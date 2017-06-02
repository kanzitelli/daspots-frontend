// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
// import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import ActionSheet from 'react-native-actionsheet';

import NavButtons  from '../../global/NavButtons';
import NavBar      from '../../global/NavBar';
import Constants   from '../../global/Constants';

@inject('App', 'Account') @observer
export default class MainScreen extends Component {
  static navigatorButtons = NavButtons.Main;
  static navigatorStyle   = NavBar.Default;

  ActionSheet = null;

  constructor(props: {}) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event: { id: string }) => {
    switch (event.id) {
      case 'profile':
        this.profileButtonPressed();
        break;
      default:
    }
  }

  componentDidMount() {
    const { Account } = this.props;

    if (!Account.isAuthenticated) Constants.Navigation.startAuthApp();
  }

  profileButtonPressed = () => {
    const { navigator } = this.props;

    navigator.push({
      ...Constants.Screens.PROFILE_SCREEN,
    })
    // this.ActionSheet.show()
  }

  // handleActionPress = (i: number) => {
  //   switch (i) {
  //     case 0: // Cancel
  //       break;
  //     case 1: // + Add new user
  //       alert('+ Add new user');
  //       break;
  //     case 2: // Change password
  //       alert('Change Password');
  //       break;
  //     case 3: // Logout
  //       this.logout();
  //       break;
  //     default:
  //
  //   }
  // }

  render() {
    const { Account } = this.props;

    // const CANCEL_INDEX      = 0
    // const DESTRUCTIVE_INDEX = 3
    // const options           = [ 'Cancel', '+ Add new user', 'Change password', 'Logout' ]
    // const title             = `Logged in as '${Account.current.first_name} ${Account.current.last_name}'`;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Da Spots Main Screen
        </Text>

        <View style={{ margin: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            This is the start page. It is a place where you can observe, search and add amazing places which you have been to 😋
          </Text>
        </View>

        {/*
          <ActionSheet
            ref={o => this.ActionSheet = o}
            title={title}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            destructiveButtonIndex={DESTRUCTIVE_INDEX}
            onPress={this.handleActionPress}
          />
        */}
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
