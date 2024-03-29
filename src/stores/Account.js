// @flow

import {
  Alert,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import { observable, action, computed, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { autobind } from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';
import RNFetchBlob from 'react-native-fetch-blob';

import stores from '../stores';
import Models from './models';
import Config from '../../config';

type CreateUser = {
  first_name : string,
  last_name  : string,
  bio        : string,
  avatar     : {},
  email      : string,
  password   : string,
}

type UpdateUser = {
  first_name? : string,
  last_name?  : string,
  bio?        : string,
  avatar?     : {},
  email?      : string,
}

window.navigator.userAgent = 'ReactNative';

@autobind
class Store {
  @persist('object', Models.Account) @observable current = new Models.Account
  @persist @observable isAuthenticated = false;
  @observable isConnecting = false;
  @observable isAuthenticating = false;
  @observable isUploadingAvatar = false;
  @observable users = [];
  @observable longitude = undefined; // долгота
  @observable latitude  = undefined; // широта

  // TODO: полный бред, надо будет переделать эту логику
  app = {};

  constructor() {
    const options = { transports: ['websocket'], pingTimeout: 3000, pingInterval: 5000 };
    const socket  = io(Config.FEATHERS_SERVER_LINK, options);

    this.app = feathers()
      .configure(socketio(socket, { timeout: 60000 }))
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

      this.connect();
    });
  }

  subscribeToServices = () => {
    this.app.service('locations').on('created', createdLocation => {
      runInAction('locations created on', () => {
        stores.Locations.all.unshift(createdLocation);
      })
    });

    this.app.service('users').on('created', createdUser => {
      runInAction('users created on', () => {
        const newUsers = this.users;
        newUsers.push(createdUser);
        this.users = newUsers;
      })
    });

    // get current location
    if (stores.App.isAndroid) {
      const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

      PermissionsAndroid.request(
        permission,
        {
          title: 'for daspots search',
          message: 'for better results',
        }
      ).then(granted => {
        this.getCurrentLocation();
      })
    } else { this.getCurrentLocation(); }
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        runInAction('obtained current location', () => {
          this.latitude  = position.coords.latitude;
          this.longitude = position.coords.longitude;
        })
      },
      (error) => { alert(error) },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  // done: изменить на object
  createAccount = (user: CreateUser, withUserAuth?: boolean = true) => {
    const userData = user;

    return this.app.service('users').create(userData).then((result) => {
      if (withUserAuth) return this.authenticate(Object.assign(userData, { strategy: 'local' }))
    });
  }

  updateAccountInfo = (id: number, user: UpdateUser) => {
    const userData = user;

    return this.app.service('users').patch(id, userData).then((newUser) => {
      console.log('newUser -> ', newUser);

      // проверку получше мб сделать -> https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
      if (!Array.isArray(newUser)) this.current = newUser;
    });
  }

  uploadAccountAvatarWith = (uri: string) => {
    const that = this;
    that.isUploadingAvatar = true;

    return new Promise((resolve, reject) => {

      that.app.service('uploads').create({ uri })
            .then((result) => { that.isUploadingAvatar = false; resolve(result); })
            .catch(error => { that.isUploadingAvatar = false; reject(error); })

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
