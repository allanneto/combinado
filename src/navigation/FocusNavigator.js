import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import WorkFocus from '~/modules/settings/WorkFocus/index';
import WorkAddr from '~/modules/settings/WorkAddr';
import ProfilePicture from '~/modules/settings/ProfilePicture';

import TabNavigator1 from './MainTabNavigator1';
import TabNavigator2 from './MainTabNavigator2';

const FocusNavigatior = createStackNavigator({
  WorkFocus: {
    screen: WorkFocus,
  },
  UserPicture: {
    screen: ProfilePicture,
    navigationOptions: {
      headerShown: false,
    },
  },
  WorkAddr: {
    screen: WorkAddr,
  },
  TabNavigator1: {
    screen: TabNavigator1,
    navigationOptions: {
      header: null,
    },
  },
  TabNavigator2: {
    screen: TabNavigator2,
    navigationOptions: {
      header: null,
    },
  },
});
const AppContainer = createAppContainer(FocusNavigatior);

export default AppContainer;
