import {createStackNavigator} from 'react-navigation-stack';
import Colors from '~/config/Colors';

import MessagesScreen from '~/screens/MessagesScreen';
import ChatView from '~/modules/events/chat/ChatView';

const MessagesScreenNavigator = createStackNavigator(
  {
    Messages: {
      screen: MessagesScreen,
    },
    ChatView: {
      screen: ChatView,
    },
  },
  {
    defaultNavigationOptions: {
      cardStyle: {backgroundColor: Colors.lightBG},
    },
  },
);

export default MessagesScreenNavigator;
