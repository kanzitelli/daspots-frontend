// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
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

  onSearchTextChanged = (query: string) => {
    const { Locations } = this.props;
    this.setState({ query });

    Locations.searchInReDB(query);
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
        data={toJS(Locations.to_show)}
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
          onChangeText={ this.onSearchTextChanged }
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

  renderFooter = () => {
    const { Locations } = this.props;

    return (
      <View style={styles.listFooter}>
        <Text>
          123
        </Text>
      </View>
    )
  }

  _keyExtractor = (item, index) => item.id;

  renderLocationCell = ({item}) => {
    return (
      <View style={styles.locationCell}>
        <TouchableOpacity
          onPress={() => alert('open profile')}
        >
          <Image
            style={styles.image}
            source={{ uri: item.user.avatar.uri }}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 8, }}>
          <Text style={styles.text}>Name: { item.name }</Text>
          <Text style={styles.text}>Address: { item.address }</Text>
          <Text style={styles.text}>Quote: "{ item.quote }"</Text>
          <Text style={styles.text}>Added by: { `${item.user.first_name} ${item.user.last_name}` }</Text>

          <TouchableOpacity
            style={{ flex: 1, margin: 4, }}
            onPress={() => this.openDirections(item.latitude, item.longitude)}
          >
            <Text style={styles.getDirections}>
              Get directions
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  openDirections = (latitude: number, longitude: number) => {
    Linking.openURL(`http://maps.google.com/maps?daddr=${latitude},${longitude}`);
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
    flexDirection: 'row',
    padding: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
    margin: 4,
  },
  getDirections: {
    fontSize: 20, color:
    Constants.Colors.tintColor
  },

  listHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingVertical: 30,
  },
  listFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
