// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  CameraRoll,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
// import _ from 'lodash';

import Constants  from '../../global/Constants';

type Props = {
  onPhotoPressed : void,
}

class CameraRollScreen extends Component {
  state = {
    photos: [],
  }

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.getPhotos();
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 25,
      assetType: 'Photos'
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  onPhotoPressed = (file) => {
    const { navigator, onPhotoPressed } = this.props;

    onPhotoPressed(file);
    navigator.pop();
  }

  render() {
    const { photos } = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.ScrollView_Main}>
        {
          photos.map((p, i) => {
            return (
              <TouchableHighlight
                key={i}
                underlayColor='transparent'
                onPress={() => this.onPhotoPressed(p.node)}
              >
                <Image
                  style={{
                    width: Constants.Layout.window.width/3,
                    height: Constants.Layout.window.width/3,
                  }}
                  source={{uri: p.node.image.uri}}
                />
              </TouchableHighlight>
            )
          })
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  ScrollView_Main: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: Constants.Colors.whiteColor,
  },
})

CameraRollScreen.propTypes = {
  onPhotoPressed : PropTypes.func,
}

export default CameraRollScreen;
