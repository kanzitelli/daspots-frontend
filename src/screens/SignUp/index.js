// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import Config     from '../../../config';
import Models     from '../../stores/models';
import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';
import Components from '../components';

type State = {
  email      : string,
  password   : string,
  first_name : string,
  last_name  : string,
  bio        : string,
}

@inject('App', 'Account') @observer
export default class SignupScreen extends Component {
  // static navigatorButtons = NavButtons.Login;
  static navigatorStyle   = NavBar.Default;

  state: State;

  constructor(props: {}) {
    super(props);

    this.state = {
      first_name : '',
      last_name  : '',
      bio        : '',
      email      : '',
      password   : '',
    }
  }

  signUp = () => {
    const { Account } = this.props;
    const { first_name, last_name, bio, email, password } = this.state;

    // simple condition for now
    if (first_name && last_name && email && password) {
      // const avatar = new Models.Avatar;
      const avatar = { uri: Config.PLACEHOLDER_URI };

      Account.createAccount({ first_name, last_name, avatar, bio, email, password })
        .then(() => {
          Constants.Navigation.startMainApp();
        }, (error) => {
          alert(error.message);
        })
    } else {
      alert('Something wrong with input data :(');
    }
  }

  render() {
    const { Account, navigator } = this.props;
    const { email, password } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
      >

        <View style={styles.form}>

          <Components.DaTextInput
            onChangeText={ (first_name) => this.setState({ first_name }) }
            value={ this.state.first_name }
            placeholder={`First name`}
          />

          <Components.DaTextInput
            onChangeText={ (last_name) => this.setState({ last_name }) }
            value={ this.state.last_name }
            placeholder={`Last name`}
          />

          <Components.DaTextInput
            onChangeText={ (bio) => this.setState({ bio }) }
            value={ this.state.bio }
            placeholder={`Bio`}
          />

          <Components.DaTextInput
            onChangeText={ (email) => this.setState({ email }) }
            value={ this.state.email }
            placeholder={`Email`}
            autoCapitalize={'none'}
          />

          <Components.DaTextInput
            onChangeText={ (password) => this.setState({ password }) }
            value={ this.state.password }
            placeholder={`Password`}
            secureTextEntry
          />

          <Button
            title={`Sign up`}
            style={{ margin: 5 }}
            onPress={this.signUp}
          />

        </View>

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.Colors.backgroundColor,
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_input: {
    width: 250,
    height: 40,
    padding: 10,
    margin: 5,

    borderWidth: 0.5,
    borderColor: Constants.Colors.blackColor,
    borderRadius: 20,
  }
});
