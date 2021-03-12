import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import InsertToken from '~/modules/auth/NewInsertToken/index';
import ConfirmUser from '~/modules/auth/NewConfirmUser';
import ForgotPassword from '~/modules/auth/NewForgotPassword/index';
import SignIn from '~/modules/auth/NewSignIn/index';
import SignUp from '~/modules/auth/NewSignUp/index';

const AuthNavigatior = createStackNavigator({
  SignIn: {
    screen: SignIn,
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerShown: false,
    },
  },
  ConfirmUser: {
    screen: ConfirmUser,
    navigationOptions: {
      headerShown: false,
    },
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      headerShown: false,
    },
  },
  ChangePassword: {
    screen: InsertToken,
    navigationOptions: {
      headerShown: false,
    },
  },
});
const AppContainer = createAppContainer(AuthNavigatior);

export default AppContainer;
