// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import RNFetchBlob from 'react-native-fetch-blob';

import Config     from '../../../config';
import NavButtons from '../../global/NavButtons';
import NavBar     from '../../global/NavBar';
import Constants  from '../../global/Constants';
import Components from '../components';

type State = {
  query     : string,
  name      : string,
  address   : string,
  quote     : string,
  longitude : number,
  latitude  : number,
  keywords  : [],
  place_id  : string,

  imageData  : string,
  converting : boolean,
}

@inject('Account', 'Locations') @observer
export default class CreateLocation extends Component {
  // static navigatorButtons = NavButtons.Login;
  static navigatorStyle   = NavBar.Default;

  state: State;

  constructor(props: {}) {
    super(props);

    this.state = {
      query     : '',
      name      : '',
      address   : '',
      quote     : '',
      longitude : 0,
      latitude  : 0,
      keywords  : [],
      place_id  : '',

      imageData  : '',
      converting : false,
    }
  }

  addLocation = () => {
    const { Account, Locations, navigator } = this.props;
    const { name, address, quote, longitude, latitude, keywords, place_id, imageData } = this.state;

    // simple condition for now
    if (name && address && quote && longitude && latitude && keywords && place_id && imageData) {

      Locations.uploadImageForLocation(imageData)
        .then(image => {

          const picture = { ...image, uri: `${Config.AMAZON_URI_LINK}/${image.id}` };
          const newLocation = { name, address, quote, longitude, latitude, keywords, place_id, picture };

          Locations.createLocation(newLocation)
            .then(result => {
              console.log(result);
              navigator.pop();
            }).catch(err => alert(err));

        }).catch(err => alert(err));

    } else {
      alert('Something wrong with input data :(');
    }
  }

  onResultLocationPressed = (place) => {
    const { Account, Locations, navigator } = this.props;
    const { place_id, description } = place;

    Locations.searchGooglePlace(place_id)
      .then(result => {
        this.setState({
          query     : description,
          name      : result.name,
          address   : result.formatted_address,
          longitude : result.geometry.location.lng,
          latitude  : result.geometry.location.lat,
          keywords  : result.types,
          place_id  : result.place_id,
        });

        Locations.googlePlacesForSearch = [];
      })
      .catch(err => alert(err))
  }

  uploadImageButtonPressed = () => {
    const { navigator } = this.props;

    navigator.push({
      ...Constants.Screens.CAMERA_ROLL_SCREEN,
      passProps: { onPhotoPressed: this.onImagePicked }
    })
  }

  onImagePicked = (file) => {
    if (!file.image.uri) { alert('avatar uri is invalid'); return; }

    const { Account } = this.props;
    this.setState({ converting: true });

    RNFetchBlob.fs.readFile(file.image.uri, 'base64')
        .then((base64data) => {
          let base64Image = `data:image/jpeg;base64,${base64data}`;

          this.setState({ imageData: base64Image, converting: false });
        })
  }

  render() {
    const { Account, Locations, navigator } = this.props;
    const { query, quote, imageData, converting } = this.state;

    return (
      <ScrollView>
        <KeyboardAvoidingView
          behavior={'padding'}
          style={styles.container}
        >

          <Components.DaTextInput
            onChangeText={ query => this.setState({ query })}
            returnKeyType={'search'}
            onSubmitEditing={() => { if(query.length > 2) Locations.searchGooglePlacesAutoComplete(query); }}
            value={ query }
            placeholder={`Location`}
          />

          { Locations.googlePlacesForSearch.length > 0 || Locations.isFetchingForSearch ?
            <View style={styles.suggestionsBlock}>
              { Locations.isFetchingForSearch ? <ActivityIndicator animating={Locations.isFetchingForSearch} /> :
                toJS(Locations.googlePlacesForSearch)
                  .map((place) => {
                    return (
                      <TouchableOpacity
                        key={place.place_id}
                        style={styles.search_result}
                        onPress={() => this.onResultLocationPressed(place)}
                      >
                        <Text style={{fontSize: 14, textAlign: 'center'}}>{ place.description }</Text>
                      </TouchableOpacity>
                    )
                })
              }
            </View>
          : undefined}

          <Components.DaTextInput
            onChangeText={ (quote) => this.setState({ quote }) }
            value={ this.state.quote }
            placeholder={`"Quote..."`}
          />

          <View style={styles.imageWrapper}>
            <Image
              resizeMode={'contain'}
              style={styles.image}
              source={{ uri: this.state.imageData || 'https://www.buffalowildwings.com/public/images/saucelab/image-placeholder.png' }}
            />

            { this.state.converting ? <ActivityIndicator animating={this.state.converting} /> :
              <Button
                style={styles.button}
                title={`Upload image`}
                onPress={this.uploadImageButtonPressed}
              />
            }
          </View>

          { Locations.isUploadingImage ? <ActivityIndicator animating={Locations.isUploadingImage} /> :
            <Button
              style={styles.button}
              title={`Add`}
              onPress={this.addLocation}
            />
          }

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
    padding: 10,
  },
  button: {
    margin: 5,
  },

  suggestionsBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  search_result: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },

  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 150,
    borderWidth: 1,
    borderColor: Constants.Colors.lightGreyColor,
    borderRadius: 10,
    backgroundColor: Constants.Colors.lightGreyColor,
  },
});
