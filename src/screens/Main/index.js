// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';

import NavButtons  from '../../global/NavButtons';
import NavBar      from '../../global/NavBar';
import Constants   from '../../global/Constants';
import Components  from '../components';

@inject('App', 'Account', 'Locations') @observer
export default class MainScreen extends Component {
  static navigatorButtons = NavButtons.Main;
  static navigatorStyle   = NavBar.Default;

  state = {};

  constructor(props: {}) {
    super(props);

    this.state = {
      query: ''
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentDidMount() {
    const { Account, Locations } = this.props;

    Account.authenticate()
      .then (() => {
        Account.subscribeToServices();
        Locations.getAll()
          .then(result => console.log(result))
      })
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
    const { Account, Locations } = this.props;
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
      <FlatList
        data={toJS(Locations.all)}
        renderItem={this.renderLocationCell}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this.renderHeader}
      />
    );
  }

  renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Components.DaTextInput
          onChangeText={ (query) => this.setState({ query }) }
          value={ this.state.query }
          placeholder={`Search`}
        />
        <Button
          title={'+'}
          onPress={this.onAddButtonPressed}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => item.id;

  renderLocationCell = ({item}) => {
    return (
      <View style={styles.locationCell}>
        <Text style={{ textAlign: 'center' }}>Name :: { item.name }</Text>
        <Text style={{ textAlign: 'center' }}>Address :: { item.address }</Text>
        <Text style={{ textAlign: 'center' }}>Keywords :: { item.keywords.join(', ') }</Text>
        <Text style={{ textAlign: 'center' }}>Quote :: { item.quote }</Text>
        <Text style={{ textAlign: 'center' }}>User_id :: { item.user_id }</Text>
      </View>
    )
  }

  onAddButtonPressed = () => {
    const { navigator } = this.props;

    navigator.push({
      ...Constants.Screens.CREATE_LOCATION,
    })
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

  locationCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  listHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingVertical: 30,
  },
});
