// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

import NavButtons  from '../../global/NavButtons';
import NavBar      from '../../global/NavBar';
import Constants   from '../../global/Constants';

@inject('App', 'Account') @observer
export default class MainScreen extends Component {
  static navigatorButtons = NavButtons.Main;
  static navigatorStyle   = NavBar.Default;

  constructor(props: {}) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    const { Account } = this.props;

    Account.authenticate()
      .then (() => Account.subscribeToServices())
      .catch(() => Constants.Navigation.startAuthApp())
  }

  onNavigatorEvent = (event: { id: string }) => {
    switch (event.id) {
      case 'profile':
        this.profileButtonPressed();
        break;
      default:
    }
  }

  profileButtonPressed = () => {
    const { navigator } = this.props;

    navigator.push({
      ...Constants.Screens.PROFILE_SCREEN,
    })
  }

  render() {
    const { Account } = this.props;
    let waitingText = 'Authenticating...';

    if (Account.isConnecting) {
      waitingText = 'Connecting...';
    }

    return Account.isConnecting ? (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size={'large'} color={Constants.Colors.tintColor} />
        <Text style={{ textAlign: 'center', }}>{waitingText}</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {`Hello, ${Account.current.first_name} ${Account.current.last_name} :)`}
        </Text>

        <View style={{ margin: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            This is Da Spots Main Screen. It is a place where you can observe, search and add amazing places which you have been to 😋
          </Text>
        </View>
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
});
