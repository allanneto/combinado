import {createStackNavigator} from 'react-navigation-stack';

import Colors from '~/config/Colors';

import EventsScreen from '~/screens/EventsScreen';
import EventOrgData from '~/modules/events/EventOrgData';
import EventEdit from '~/modules/events/EventEdit';
import EventOrgTasks from '~/modules/events/EventOrgTasks';
import EventTaskItem from '~/modules/events/item/EventTaskItem';
import EventNome from '~/modules/events/item/EventNome';
import EventDes from '~/modules/events/item/EventDes';
import EventCel from '~/modules/events/item/EventCel';
import EventAddr from '~/modules/events/item/EventAddr';
import EventCpl from '~/modules/events/item/EventCpl';
import EventIni from '~/modules/events/item/EventIni';
import EventFim from '~/modules/events/item/EventFim';
import EventTeam from '~/modules/events/team/EventTeam';

import TeamSearch from '~/modules/events/team/TeamSearch';
import UserData from '~/modules/events/team/UserData';
import EventClose from '~/modules/events/team/EventClose';
import UserAval from '~/modules/events/team/UserAval';
import UserGroupAval from '~/modules/events/team/UserGroupAval';
import UserAvalHist from '~/modules/events/team/UserAvalHist';

import UsersScreen from '~/screens/UsersScreen';

import EventChat from '~/modules/events/chat/EventChat';
import ChatView from '~/modules/events/chat/ChatView';
import ChatMessage from '~/modules/events/chat/ChatMessage';

const EventsScreenNavigator = createStackNavigator(
  {
    Home: {
      screen: EventsScreen,
    },
    EventOrgData: {
      screen: EventOrgData,
    },
    EventEdit: {
      screen: EventEdit,
    },
    EventClose: {
      screen: EventClose,
    },
    UserAval: {
      screen: UserAval,
    },
    UserAvalHist: {
      screen: UserAvalHist,
    },
    UserGroupAval: {
      screen: UserGroupAval,
    },
    EventOrgTasks: {
      screen: EventOrgTasks,
    },
    EventTeam: {
      screen: EventTeam,
    },
    TeamSearch: {
      screen: TeamSearch,
    },
    UsersScreen: {
      screen: UsersScreen,
    },
    UserData: {
      screen: UserData,
    },
    EventTaskItem: {
      screen: EventTaskItem,
    },
    EventNome: {
      screen: EventNome,
    },
    EventDes: {
      screen: EventDes,
    },
    EventCel: {
      screen: EventCel,
    },
    EventAddr: {
      screen: EventAddr,
    },
    EventCpl: {
      screen: EventCpl,
    },
    EventIni: {
      screen: EventIni,
    },
    EventFim: {
      screen: EventFim,
    },
    EventChat: {
      screen: EventChat,
    },
    ChatView: {
      screen: ChatView,
    },
    ChatMessage: {
      screen: ChatMessage,
    },
  },
  {
    defaultNavigationOptions: {
      cardStyle: {backgroundColor: Colors.lightBG},
    },
  },
);

export default EventsScreenNavigator;
