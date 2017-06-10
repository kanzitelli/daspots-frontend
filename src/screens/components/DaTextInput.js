// @flow

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import Constants  from '../../global/Constants';

type Props = {
  onChangeText    : void,
  value           : string,
  placeholder     : string,
  secureTextEntry : boolean,
  multiline       : boolean,
  autoCapitalize  : boolean,
}

export default class DaTextInput extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { onChangeText, value, placeholder, secureTextEntry, multiline, autoCapitalize } = this.props;

    return (
      <TextInput
        style={ [styles.text_input, { height: multiline ? 60 : 40 }] }
        onChangeText={ onChangeText }
        value={ value }
        placeholder={ placeholder }
        secureTextEntry={ secureTextEntry }
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        autoCapitalize={autoCapitalize}
      />
    );
  }
}

const styles = StyleSheet.create({
  text_input: {
    width: 250,
    height: 40,
    padding: 10,
    margin: 5,

    borderWidth: 0.5,
    borderColor: Constants.Colors.blackColor,
    borderRadius: 20,
  }
});
