// @flow

import {
  Dimensions,
  Platform,
} from 'react-native';

const navBar = Platform.OS === 'ios' ? 64 : 80;

export default {
  window: {
    width  : Dimensions.get('window').width,
    height : Dimensions.get('window').height - navBar,
  },
};
