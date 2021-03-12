import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

import WorkScreen from '~/screens/WorkScreen';

import EventOrgData from '~/modules/events/EventOrgData';
import EventOrgTasks from '~/modules/events/EventOrgTasks';
import EventTaskItem from '~/modules/events/item/EventTaskItem';
import EventNome from '~/modules/events/item/EventNome';
import EventDes from '~/modules/events/item/EventDes';
import EventCel from '~/modules/events/item/EventCel';
import EventAddr from '~/modules/events/item/EventAddr';
import EventIni from '~/modules/events/item/EventIni';
import EventFim from '~/modules/events/item/EventFim';
import EventTeam from '~/modules/events/team/EventTeam';
import EventChat from '~/modules/events/chat/EventChat';
import EventQRCode from '~/modules/events/item/EventQRCode';
import ChatView from '~/modules/events/chat/ChatView';
import ChatMessage from '~/modules/events/chat/ChatMessage';

const WorkScreenNavigator = createStackNavigator(
  {
    Home: {
      screen: WorkScreen,
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
    EventIni: {
      screen: EventIni,
    },
    EventFim: {
      screen: EventFim,
    },
    EventChat: {
      screen: EventChat,
    },
    EventQRCode: {
      screen: EventQRCode,
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

export default WorkScreenNavigator;
