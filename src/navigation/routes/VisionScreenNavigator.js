import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

// import VisionScreen from '~/screens/VisionScreen'
import EventsScreen from '~/screens/EventsScreen';
import EventOrgData from '~/modules/events/EventOrgData';
import EventOrgTasks from '~/modules/events/EventOrgTasks';
import EventTaskItem from '~/modules/events/item/EventTaskItem';
import EventTipo from '~/modules/events/item/EventTipo';
import EventNome from '~/modules/events/item/EventNome';
import EventCel from '~/modules/events/item/EventCel';
import EventAddr from '~/modules/events/item/EventAddr';
import EventIni from '~/modules/events/item/EventIni';
import EventFim from '~/modules/events/item/EventFim';
import EventLim from '~/modules/events/item/EventLim';
import EventTeam from '~/modules/events/team/EventTeam';

import TeamSearch from '~/modules/events/team/TeamSearch';
import UserList from '~/modules/events/team/UserList';
import UserData from '~/modules/events/team/UserData';
import TeamData from '~/modules/events/team/TeamData';

const VisionScreenNavigator = createStackNavigator(
  {
    Home: {
      screen: EventsScreen,
      // eventOrgData: EventOrgData
    },
    EventOrgData: {
      screen: EventOrgData,
    },
    EventOrgTasks: {
      screen: EventOrgTasks,
    },
    EventTeam: {
      screen: EventTeam,
    },
    TeamData: {
      screen: TeamData,
    },
    TeamSearch: {
      screen: TeamSearch,
    },
    UserList: {
      screen: UserList,
    },
    UserData: {
      screen: UserData,
    },
    EventTaskItem: {
      screen: EventTaskItem,
    },
    EventTipo: {
      screen: EventTipo,
    },
    EventNome: {
      screen: EventNome,
    },
    EventCel: {
      screen: EventCel,
    },
    EventAddr: {
      screen: EventAddr,
    },
    EventIni: {
      screen: EventIni,
    },
    EventFim: {
      screen: EventFim,
    },
    EventLim: {
      screen: EventLim,
    },
  },
  {
    cardStyle: {backgroundColor: Colors.lightBG},
  },
);

export default VisionScreenNavigator;
