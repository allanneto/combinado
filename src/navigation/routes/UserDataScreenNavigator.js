import {createStackNavigator} from 'react-navigation-stack';

import UserData from '~/modules/events/team/UserData';
import UserAvalHist from '~/modules/events/team/UserAvalHist';
import UserAval from '~/modules/events/team/UserAval';
import PersonMedia from '~/modules/settings/Person/PersonMedia';
import PersonMediaView from '~/modules/settings/Person/PersonMediaView';
import PersonLinks from '~/modules/settings/Person/PersonLinks';
import PersonLinksView from '~/modules/settings/Person/PersonLinksView';
import LinkView from '~/modules/settings/Person/LinkView';

const UserDataScreenNavigator = createStackNavigator({
  UserData: {
    screen: UserData,
  },
  UserAval: {
    screen: UserAval,
  },
  UserAvalHist: {
    screen: UserAvalHist,
  },
  PersonMedia: {
    screen: PersonMedia,
  },
  PersonMediaView: {
    screen: PersonMediaView,
  },
  PersonLinks: {
    screen: PersonLinks,
  },
  PersonLinksView: {
    screen: PersonLinksView,
  },
  LinkView: {
    screen: LinkView,
  },
});

export default UserDataScreenNavigator;
