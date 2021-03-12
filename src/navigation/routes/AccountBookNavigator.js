import {createStackNavigator} from 'react-navigation-stack';

import AccountBook from '~/modules/finance/AccountBook';

const AccountBookNavigator = createStackNavigator({
  AccountBook: {
    screen: AccountBook,
    navigationOptions: {
      headerShown: false,
    },
  },
});

export default AccountBookNavigator;
