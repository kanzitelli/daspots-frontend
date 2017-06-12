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
  style           : {},
  onChangeText    : void,
  value           : string,
  placeholder     : string,
  secureTextEntry : boolean,
  multiline       : boolean,
  autoCapitalize  : boolean,
  returnKeyType   : string,
  onSubmitEditing : void,
  autoFocus       : boolean,
}

export default class DaTextInput extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { autoFocus, onSubmitEditing, returnKeyType, style, onChangeText, value, placeholder, secureTextEntry, multiline, autoCapitalize } = this.props;

    return (
      <TextInput
        style={ [styles.text_input, { height: multiline ? 60 : 40 }, style] }
        onChangeText={ onChangeText }
        value={ value }
        placeholder={ placeholder }
        secureTextEntry={ secureTextEntry }
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
      />
    );
  }
}

const styles = StyleSheet.create({
  text_input: {
    flex: 1,
    height: 40,
    padding: 10,
    margin: 10,
    marginVertical: 5,

    borderWidth: 0.5,
    borderColor: Constants.Colors.blackColor,
    borderRadius: 10,
  }
});
