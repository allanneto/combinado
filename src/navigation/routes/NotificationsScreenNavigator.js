import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

import NotificationsScreen from '~/screens/NotificationsScreen';
import NotificationData from '~/modules/notifications/NotificationData';
import UserData from '~/modules/events/team/UserData';
import UserAvalHist from '~/modules/events/team/UserAvalHist';
import UserAval from '~/modules/events/team/UserAval';

import EventOrgData from '~/modules/events/EventOrgData';
import EventNome from '~/modules/events/item/EventNome';
import EventDes from '~/modules/events/item/EventDes';
import EventCel from '~/modules/events/item/EventCel';
import EventAddr from '~/modules/events/item/EventAddr';
import EventCpl from '~/modules/events/item/EventCpl';
import EventIni from '~/modules/events/item/EventIni';
import EventFim from '~/modules/events/item/EventFim';

import EventChat from '~/modules/events/chat/EventChat';
import ChatView from '~/modules/events/chat/ChatView';
import ChatMessage from '~/modules/events/chat/ChatMessage';

const NotificationsScreenNavigator = createStackNavigator(
  {
    Notifications: {
      screen: NotificationsScreen,
    },
    NotificationData: {
      screen: NotificationData,
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
    EventOrgData: {
      screen: EventOrgData,
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

export default NotificationsScreenNavigator;
