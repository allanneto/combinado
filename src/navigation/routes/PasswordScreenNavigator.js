import {createStackNavigator} from 'react-navigation-stack';

import ProfilePassword from '~/modules/settings/Profile/ProfilePassword';

const PasswordScreenNavigator = createStackNavigator({
  Password: {
    screen: ProfilePassword,
  },
});

export default PasswordScreenNavigator;
