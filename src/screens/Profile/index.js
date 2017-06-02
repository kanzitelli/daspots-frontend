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

  onNavigatorEvent = (event: { id: string }) => {
    switch (event.id) {
      case 'edit':
        alert('Edit button pressed');
        break;
      default:
    }
  }

  logout = () => {
    const { Account } = this.props;

    Account.logout().then(() => Constants.Navigation.startAuthApp())
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
                detail={'Full name'}
              />
              <Cell
                cellStyle="RightDetail"
                title={`${email}`}
                detail={"Email"}
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
                onPress={() => alert('+ Add new profile')}
                titleTextColor={Constants.Colors.tableButtonActionColor}
              />
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
