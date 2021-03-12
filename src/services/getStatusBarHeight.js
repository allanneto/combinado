import {Platform, StatusBar} from 'react-native';

export function getStatusBarHeight() {
  if (Platform.OS === 'ios') {
    return 0;
  }
  return StatusBar.currentHeight;
}
