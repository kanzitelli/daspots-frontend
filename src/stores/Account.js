// @flow

import { Alert, AsyncStorage } from 'react-native';
import { observable, action, computed, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { autobind } from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';

import Models from './models';
import Config from '../../config';

window.navigator.userAgent = 'ReactNative';

@autobind
class Store {
  @persist('object', Models.Account) @observable current = new Models.Account
  @persist @observable isAuthenticated = false;
  @observable isConnecting = false;
  @observable isAuthenticating = false;
  @observable users = [];

  constructor() {
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    const socket  = io(Config.FEATHERS_SERVER_LINK, options);

    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      .configure(authentication({
        storage: AsyncStorage // To store our accessToken
      }));

    this.connect();

    if (this.app.get('accessToken')) {
      this.isAuthenticated = this.app.get('accessToken') !== null;
    }
  }

  connect = () => {
    this.isConnecting = true;

    this.app.io.on('connect', () => {
      this.isConnecting = false;
    });

    this.app.io.on('disconnect', () => {
      this.isConnecting = true;
    });
  }

  subscribeToServices = () => {
    console.log('subscribeToServices');
    // this.app.service('locations').on('created', createdLocation => {
    //   this.messages.unshift(this.formatMessage(createdMessage));
    // });

    this.app.service('users').on('created', createdUser => {
      runInAction('users created on', () => {
        const newUsers = this.users;
        newUsers.push(createdUser);
        this.users = newUsers;
      })
    });
  }

  createAccount = (first_name: string, last_name: string, email: string, password: string, withUserAuth?: boolean = true) => {
    const userData = { first_name, last_name, email, password };

    return this.app.service('users').create(userData).then((result) => {
      if (withUserAuth) return this.authenticate(Object.assign(userData, { strategy: 'local' }))
    });
  }

  login = (email: string, password: string) => {
    const payload = {
      strategy: 'local',
      email,
      password
    };

    return this.authenticate(payload);
  }

  authenticate = (options: {} = undefined) => {
    this.isAuthenticating = true;

    return this._authenticate(options).then(user => {
      console.log('authenticated successfully', user.id, user.email);

      console.log("NEW USER ::: ", user);
      this.current = user;
      this.isAuthenticated = true;
      this.isAuthenticating = false;

      return Promise.resolve(user);
    }).catch(error => {
      console.log('authenticated failed', error.message);
      console.log(error);

      return Promise.reject(error);
    });
  }

  _authenticate = (payload) => {
    return this.app.authenticate(payload)
      .then(response => {
        return this.app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        return this.app.service('users').get(payload.userId);
      }).catch(e => Promise.reject(e));
  }

  logout = () => {
    return new Promise((resolve, reject) => {
      this.app.logout()
        .then(() => {
          this.current = {};
          this.isAuthenticated = false;

          resolve();
        });
    });
  }

  promptForLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  loadUsers = () => {
    return this.app.service('users').find()
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        alert('loadUsers error -> ', error);
      })
  }

  changeCurrentUserTo = (user: {email: string}, password: string) => {
    return new Promise((resolve, reject) => {
      const that = this;

      //
      that.logout().then(() => {
        that.login(user.email, password).then(() => {
            that.current = user;
            this.isAuthenticated = true;

            resolve();
          })
        });
    });
  }

}

export default new Store();
