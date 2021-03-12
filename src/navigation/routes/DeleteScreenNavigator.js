import {createStackNavigator} from 'react-navigation-stack';

import ProfileDelete from '~/modules/settings/Profile/ProfileDelete';

const DeleteScreenNavigator = createStackNavigator({
  Password: {
    screen: ProfileDelete,
  },
});

export default DeleteScreenNavigator;
