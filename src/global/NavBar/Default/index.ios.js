// @flow

import Constants from '../../Constants';

// [more info] - https://wix.github.io/react-native-navigation/#/styling-the-navigator
export default {
  navBarTextColor       : Constants.Colors.whiteColor,
  navBarBackgroundColor : Constants.Colors.tintColor,
  navBarButtonColor     : Constants.Colors.whiteColor,
  screenBackgroundColor : Constants.Colors.backgroundColor,

  statusBarTextColorScheme : Constants.Colors.statusBarColor, // make sure that in Xcode > project > Info.plist, the property View controller-based status bar appearance is set to YES
}
