// @flow

import { Platform }   from 'react-native';
import { Navigation } from 'react-native-navigation';
import Constants      from '../Constants';
import TabBar         from '../TabBar';

const startMainApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
      ...Constants.Screens.MAIN_SCREEN,
    },
    animationType: 'fade',
  });
}

const startAuthApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
      ...Constants.Screens.WELCOME_SCREEN,
    },
    animationType: 'fade',
  });
}

export default {
  startAuthApp,
  startMainApp
}
