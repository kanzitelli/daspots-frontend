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
  ActivityIndicator,
} from 'react-native';
import { inject, observer } from 'mobx-react/native';
import RNFetchBlob from 'react-native-fetch-blob';

import Config     from '../../../config';
import Models     from '../../stores/models';
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

  tmp_avatar : string,
  converting : boolean,
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
      password   : mode === 'create' ? '' : 'will_be_hidden',

      tmp_avatar : '',
      converting : false,
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
        const avatar = { uri: Config.PLACEHOLDER_URI };

        Account.createAccount({ first_name, last_name, avatar, bio, email, password }, false)
          .then(() => {
            this.closeModalWithSuccessfulAlert();
          }, (error) => {
            alert(error.message);
          })
      } else {
        if (this.state.tmp_avatar) {

          Account.uploadAccountAvatarWith(this.state.tmp_avatar)
            .then((_avatar) => {
              // updatim только avatar.id !!!
              const avatar = { ..._avatar, uri: `${Config.AMAZON_URI_LINK}/${_avatar.id}` }
              const userData = { first_name, last_name, avatar, bio, email };

              Account.updateAccountInfo(Account.current.id, userData, false)
                .then(() => {
                  this.closeModalWithSuccessfulAlert();
                })
                .catch(error => console.log(error.message))
            })
            .catch(error => { console.log(`ERRORS ::: ${error}`); alert('Could not upload. Please try later, or make sure that file is less than 10MB and you have stable internet connection :)'); })
        } else {

          const userData = { first_name, last_name, bio, email };

          Account.updateAccountInfo(Account.current.id, userData, false)
            .then(() => {
              this.closeModalWithSuccessfulAlert();
            })
            .catch(error => console.log(error.message))

        }

      }

    } else {
      alert('Something wrong with input data :(');
    }
  }

  closeModalWithSuccessfulAlert = () => {
    const { Account, navigator, mode } = this.props;
    const { first_name, last_name, bio, email, password } = this.state;

    navigator.dismissModal();
    // Alert.alert(
    //   mode === 'create' ? 'New account' : 'Edit account',
    //   mode === 'create' ? `'${email}' was created successfully` : 'changes were successfully changed',
    //   [
    //     {text: 'Great!', onPress: () => navigator.dismissModal()},
    //   ],
    //   { cancelable: false }
    // );
  }

  changePasswordPressed = () => {
    alert('handle changePasswordPressed');
  }

  uploadAvatarButtonPressed = () => {
    const { navigator } = this.props;

    navigator.push({
      ...Constants.Screens.CAMERA_ROLL_SCREEN,
      passProps: { onPhotoPressed: this.onAvatarPicked }
    })
  }

  onAvatarPicked = (file) => {
    if (!file.image.uri) { alert('avatar uri is invalid'); return; }

    const { Account } = this.props;
    this.setState({ converting: true });

    RNFetchBlob.fs.readFile(file.image.uri, 'base64')
        .then((base64data) => {
          let base64Image = `data:image/jpeg;base64,${base64data}`;

          // console.log(base64Image);
          this.setState({ tmp_avatar: base64Image, converting: false });

          // // this.props.addImagesToUntagged(data.path);
        })
    // Account.uploadAccountAvatarWith(file);
  }

  render() {
    const { Account, navigator, mode } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}
        >

          { mode === 'edit' ? (
            <View style={styles.imageWrapper}>
              <Image
                style={styles.image}
                source={{ uri: this.state.tmp_avatar || (mode === 'edit' ? Account.current.avatar.uri : 'https://facebook.github.io/react/img/logo_og.png') }}
              />

              { this.state.converting ? <ActivityIndicator animating={this.state.converting} /> :
                <Button
                  style={{ margin: 5, fontSize: 12 }}
                  onPress={this.uploadAvatarButtonPressed}
                  title={'Upload new avatar'}
                />
              }

            </View>
          ) : null }

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
              autoCapitalize={'none'}
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

            { Account.isUploadingAvatar ? <ActivityIndicator animating={Account.isUploadingAvatar} /> :
              <Button
                style={{ margin: 5 }}
                title={mode === 'edit' ? `Save changes` : `Create`}
                onPress={this.handleCreateEditAction}
              />
            }


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
    justifyContent: 'center',
    alignItems: 'center',

    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
