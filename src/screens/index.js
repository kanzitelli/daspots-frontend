// @flow

import { Navigation } from 'react-native-navigation';

import Constants from '../global/Constants';

import CameraRoll from './CameraRoll';
import Main    from './Main';
import Profile from './Profile';
import Welcome from './Welcome';
import SignUp  from './SignUp';
import Login   from './Login';

import CreateEditAccount from './CreateEditAccount';

export function registerScreens(store: {}, Provider: {}) {
  Navigation.registerComponent(Constants.Screens.MAIN_SCREEN.screen,    () => Main, store, Provider);
  Navigation.registerComponent(Constants.Screens.PROFILE_SCREEN.screen, () => Profile, store, Provider);

  Navigation.registerComponent(Constants.Screens.CAMERA_ROLL_SCREEN.screen, () => CameraRoll, store, Provider);
  Navigation.registerComponent(Constants.Screens.CREATE_EDIT_ACCOUNT_SCREEN.screen, () => CreateEditAccount, store, Provider);

  Navigation.registerComponent(Constants.Screens.WELCOME_SCREEN.screen, () => Welcome, store, Provider);
  Navigation.registerComponent(Constants.Screens.SIGNUP_SCREEN.screen,  () => SignUp, store, Provider);
  Navigation.registerComponent(Constants.Screens.LOGIN_SCREEN.screen,   () => Login, store, Provider);
}
