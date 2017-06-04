// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';

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

type Props = {
  mode: string,
}

@inject('App', 'Account') @observer
export default class CreateEditAccountScreen extends Component {
  static navigatorButtons = NavButtons.CreateEditAccount;
  static navigatorStyle   = NavBar.Default;

  state: State;

  constructor(props: Props) {
    super(props);

    const { Account, mode } = props;

    this.state = {
      first_name : mode === 'create' ? '' : Account.current.first_name,
      last_name  : mode === 'create' ? '' : Account.current.last_name,
      bio        : mode === 'create' ? '' : Account.current.bio,
      email      : mode === 'create' ? '' : Account.current.email,
      password   : mode === 'create' ? '' : 'will_be_hidden ',
    }

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event: { id: string }) => {
    const { navigator } = this.props;

    switch (event.id) {
      case 'cancel':
        navigator.dismissModal();
        break;
      default:
    }
  }

  handleCreateEditAction = () => {
    const { Account, navigator, mode } = this.props;
    const { first_name, last_name, bio, email, password } = this.state;

    // simple condition for now
    if (first_name && last_name && email && password) {

      if (mode === 'create') {
        Account.createAccount(first_name, last_name, email, password, false)
          .then(() => {
            this.closeModalWithSuccessfulAlert();
          }, (error) => {
            alert(error.message);
          })
      } else {
        Account.updateAccountInfo(Account.current.id, first_name, last_name, bio, email, password, false)
          .then(() => {
            this.closeModalWithSuccessfulAlert();
          }, (error) => {
            alert(error.message);
          })
      }

    } else {
      alert('Something wrong with input data :(');
    }
  }

  closeModalWithSuccessfulAlert = () => {
    const { Account, navigator, mode } = this.props;
    const { first_name, last_name, bio, email, password } = this.state;

    Alert.alert(
      mode === 'create' ? 'New account' : 'Edit account',
      mode === 'create' ? `'${email}' was created successfully` : 'changes were successfully changed',
      [
        {text: 'Great!', onPress: () => navigator.dismissModal()},
      ],
      { cancelable: false }
    );
  }

  changePasswordPressed = () => {
    alert('handle changePasswordPressed');
  }

  render() {
    const { Account, navigator, mode } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}
        >

          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              source={{ uri: (mode === 'edit' ? (Account.current.avatar || 'https://facebook.github.io/react/img/logo_og.png') : 'https://facebook.github.io/react/img/logo_og.png') }}
            />
            <Button
              style={{ margin: 5 }}
              onPress={() => alert('Upload new avatar')}
              title={'Upload new avatar (move to edit page)'}
            />
          </View>

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
              multiline
            />

            <Components.DaTextInput
              onChangeText={ (email) => this.setState({ email }) }
              value={ this.state.email }
              placeholder={`Email`}
            />

            { mode === 'edit' ? (
              <Button
                style={{ margin: 5 }}
                title={`Change password`}
                onPress={this.changePasswordPressed}
              />
            ) : (
              <Components.DaTextInput
                onChangeText={ (password) => this.setState({ password }) }
                value={ this.state.password }
                placeholder={`Password`}
                secureTextEntry
              />
            ) }

            <Button
              style={{ margin: 5 }}
              title={mode === 'edit' ? `Save changes` : `Create`}
              onPress={this.handleCreateEditAction}
            />

          </View>

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
  },
  form: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text_input: {
    height: 40,
    padding: 10,
    margin: 5,

    borderWidth: 0.5,
    borderColor: Constants.Colors.blackColor,
    borderRadius: 20,
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
});
