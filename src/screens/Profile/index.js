// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';
import prompt from 'react-native-prompt-android';
import { inject, observer } from 'mobx-react/native';

import NavButtons  from '../../global/NavButtons';
import NavBar      from '../../global/NavBar';
import Constants   from '../../global/Constants';

@inject('App', 'Account') @observer
export default class ProfileScreen extends Component {
  static navigatorButtons = NavButtons.Profile;
  static navigatorStyle   = NavBar.Default;

  constructor(props: {}) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    const { Account } = this.props;

    Account.loadUsers();
  }

  onNavigatorEvent = (event: { id: string }) => {
    switch (event.id) {
      case 'edit':
        this.openCreateEditAccountScreenWith('edit');
        break;
      default:
    }
  }

  openCreateEditAccountScreenWith = (mode: string) => {
    const { navigator } = this.props;

    navigator.showModal({
      ...Constants.Screens.CREATE_EDIT_ACCOUNT_SCREEN,
      title: `${mode} account`,
      passProps: { mode },
    })
  }

  addNewProfileButtonPressed = () => {
    this.openCreateEditAccountScreenWith('create');
  }

  logout = () => {
    const { Account } = this.props;

    Account.logout().then(() => Constants.Navigation.startAuthApp())
  }

  onUserPressed = (user: { email: string }) => {
    const { navigator, Account } = this.props;

    prompt(
      `Enter password`,
      `for account with email '${user.email}':`,
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK',     onPress: password => Account.changeCurrentUserTo(user, password).then(() => navigator.pop()) },
      ],
      {
        type: 'secure-text',
        cancelable: false,
        defaultValue: '',
        placeholder: 'Password'
      }
    );
  }

  render() {
    const { App, Account } = this.props;
    const { first_name, last_name, avatar, bio, email } = Account.current;

    return (
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{ uri: (avatar || 'https://facebook.github.io/react/img/logo_og.png') }}
            />
            <TouchableOpacity
              style={{ marginTop: 8 }}
              onPress={() => alert('Upload new avatar')}
            >
              <Text>
                Upload new avatar (move to edit page)
              </Text>
            </TouchableOpacity>
          </View>

          <TableView>
            <Section>
              <Cell
                cellStyle="RightDetail"
                title={`${first_name} ${last_name}`}
                detail={'Name'}
              />
              <Cell
                cellStyle="RightDetail"
                title={`${email}`}
                detail={"Email"}
              />
              <Cell
                cellStyle="RightDetail"
                title={`${bio || ''}`}
                detail={"Bio"}
              />
              <Cell
                cellStyle="Basic"
                title="Logout"
                onPress={this.logout}
                titleTextColor={Constants.Colors.redColor}
              />
            </Section>

            <Section header="All profiles">
              <Cell
                cellStyle="Basic"
                title={'+ Add new account'}
                onPress={this.addNewProfileButtonPressed}
                titleTextColor={Constants.Colors.tableButtonActionColor}
              />
              {
                Account.users
                  .filter(user => user.id != Account.current.id)
                  .map(user => {
                    return (
                      <Cell
                        key={`${user.id}`}
                        cellStyle="Basic"
                        title={`${user.first_name} ${user.last_name}`}
                        onPress={ () => this.onUserPressed(user) }
                        image={
                          <Image style={{ borderRadius: 15 }} source={{ uri: (user.avatar || 'https://facebook.github.io/react/img/logo_og.png') }} />
                        }
                      />
                    )
                  })
              }
            </Section>
          </TableView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Constants.Colors.backgroundColorWithTable,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Constants.Colors.backgroundColorWithTable,
  },
});
