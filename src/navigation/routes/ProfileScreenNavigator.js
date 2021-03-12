import {createStackNavigator} from 'react-navigation-stack';

import ProfileScreen from '~/modules/settings/ProfileScreen';

const ProfileScreenNavigator = createStackNavigator({
  Profile: {
    screen: ProfileScreen,
  },
});

export default ProfileScreenNavigator;
