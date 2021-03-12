import {createStackNavigator} from 'react-navigation-stack';

import CentralScreen from '~/modules/settings/CentralScreen';
import FAQScreen from '~/modules/settings/FAQScreen';

const CentralScreenNavigator = createStackNavigator({
  Central: {
    screen: CentralScreen,
  },
  FAQ: {
    screen: FAQScreen,
  },
});

export default CentralScreenNavigator;
