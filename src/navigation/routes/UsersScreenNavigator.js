import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

import UsersScreen from '~/screens/UsersScreen';
import UserData from '~/modules/events/team/UserData';
import TeamSearch from '~/modules/events/team/TeamSearch';
import UserAvalHist from '~/modules/events/team/UserAvalHist';
import UserAval from '~/modules/events/team/UserAval';
import PersonMediaView from '~/modules/settings/Person/PersonMediaView';
import LinkView from '~/modules/settings/Person/LinkView';

const UsersScreenNavigator = createStackNavigator(
  {
    Home: {
      screen: UsersScreen,
    },
    UserData: {
      screen: UserData,
    },
    UserAval: {
      screen: UserAval,
    },
    UserAvalHist: {
      screen: UserAvalHist,
    },
    PersonMediaView: {
      screen: PersonMediaView,
    },
    LinkView: {
      screen: LinkView,
    },
    TeamSearch: {
      screen: TeamSearch,
    },
  },
  {
    defaultNavigationOptions: {
      cardStyle: {backgroundColor: Colors.lightBG},
    },
  },
);

export default UsersScreenNavigator;
