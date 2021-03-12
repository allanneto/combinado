import {createStackNavigator} from 'react-navigation-stack';

import AccountWithdraw from '~/modules/finance/AccountWithdraw';

const AccountWithdrawNavigator = createStackNavigator({
  AccountWithdraw: {
    screen: AccountWithdraw,
  },
});

export default AccountWithdrawNavigator;
