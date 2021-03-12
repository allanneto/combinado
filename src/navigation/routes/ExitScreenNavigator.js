import {createStackNavigator} from 'react-navigation-stack';

import ExitScreen from '~/modules/settings/ExitScreen';

const ExitScreenNavigator = createStackNavigator({
  Exit: {
    screen: ExitScreen,
  },
});

export default ExitScreenNavigator;
