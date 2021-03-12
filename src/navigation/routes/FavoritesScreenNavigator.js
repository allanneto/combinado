import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

import FavoritesScreen from '~/screens/FavoritesScreen';

const FavoritesScreenNavigator = createStackNavigator(
  {
    Home: {
      screen: FavoritesScreen,
    },
  },
  {
    defaultNavigationOptions: {
      cardStyle: {backgroundColor: Colors.lightBG},
    },
  },
);

export default FavoritesScreenNavigator;
