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

import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';
import Components from '../components';

type State = {
  email    : string,
  password : string,
}

@inject('Account') @observer
export default class LoginScreen extends Component {
  // static navigatorButtons = NavButtons.Login;
  static navigatorStyle   = NavBar.Default;

  state: State;

  constructor(props: {}) {
    super(props);

    this.state = {
      email    : '',
      password : '',
    }
  }

  login = () => {
    const { Account } = this.props;
    const { email, password } = this.state;

    // simple condition for now
    if (email && password) {
      Account.login(email, password)
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
            onChangeText={ (email) => this.setState({ email }) }
            value={ this.state.email }
            placeholder={`Email`}
          />

          <Components.DaTextInput
            onChangeText={ (password) => this.setState({ password }) }
            value={ this.state.password }
            placeholder={`Password`}
            secureTextEntry
          />

          <Button
            style={{ margin: 5 }}
            title={`Log in`}
            onPress={this.login}
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
    flex: 1,
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
