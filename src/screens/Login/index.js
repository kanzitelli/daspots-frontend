// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
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
      <ScrollView>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}
        >

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
            style={{ margin: 5 }}
            title={`Log in`}
            onPress={this.login}
          />

        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.Colors.backgroundColor,
    padding: 10,
  },
});
