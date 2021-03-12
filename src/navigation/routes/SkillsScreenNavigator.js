import {createStackNavigator} from 'react-navigation-stack';

import Skills from '~/modules/settings/SkillsScreen';
import PersonInfo from '~/modules/settings/Person/PersonInfo';
import PersonMedia from '~/modules/settings/Person/PersonMedia';
import PersonMediaView from '~/modules/settings/Person/PersonMediaView';
import PersonLinks from '~/modules/settings/Person/PersonLinks';
import PersonLinksView from '~/modules/settings/Person/PersonLinksView';
import LinkView from '~/modules/settings/Person/LinkView';

const SkillsScreenNavigator = createStackNavigator({
  Skills: {
    screen: Skills,
  },
  PersonInfo: {
    screen: PersonInfo,
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

export default SkillsScreenNavigator;
