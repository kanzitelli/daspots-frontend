// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';

@inject('Account') @observer
export default class WelcomeScreen extends Component {
  static navigatorStyle   = NavBar.Default;

  render() {
    return (
      <View style={styles.container}>
        <Button
          title={`LOG IN`}
          style={{ margin: 5 }}
          onPress={() => {
            this.props.navigator.push({
              ...Constants.Screens.LOGIN_SCREEN
            });
          }}
        />

        <Button
          title={`SIGN UP`}
          style={{ margin: 5 }}
          onPress={() => {
            this.props.navigator.push({
              ...Constants.Screens.SIGNUP_SCREEN
            });
          }}
        />
      </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
