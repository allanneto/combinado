import React from 'react';
import {StyleSheet} from 'react-native';

import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import {Icon} from 'react-native-elements';
import Colors from '../config/Colors';
import EventsScreenNavigator from './routes/EventsScreenNavigator';
import UsersScreenNavigator from './routes/UsersScreenNavigator';
import NotificationsScreenNavigator from './routes/NotificationsScreenNavigator';
import MessagesScreenNavigator from './routes/MessagesScreenNavigator';

const TabNavigator2 = createMaterialBottomTabNavigator(
  {
    Vision: {
      screen: EventsScreenNavigator,
      navigationOptions: {
        title: 'Eventos',
        tabBarIcon: ({focused}) => (
          <Icon
            // name={`flag${focused ? '' : '-outline'}`}
            name={'restaurant-menu'}
            type={'material'}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
      },
    },
    Users: {
      screen: UsersScreenNavigator,
      navigationOptions: {
        title: 'Prestadores',
        tabBarIcon: ({focused}) => (
          <Icon
            name={'people'}
            type={'material'}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
      },
    },
    Notification: {
      screen: NotificationsScreenNavigator,
      navigationOptions: {
        title: 'Notificações',
        tabBarIcon: ({focused}) => (
          <Icon
            name={'notifications'}
            type={'material'}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
      },
    },
    Message: {
      screen: MessagesScreenNavigator,
      navigationOptions: {
        title: 'Chats',
        tabBarIcon: ({focused}) => (
          <Icon
            name={'comment-multiple'}
            type={'material-community'}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
      },
    },
  },
  {
    shifting: false,
    activeColor: Colors.tabIconSelected,
    inactiveColor: Colors.tabIconDefault,
    barStyle: {
      backgroundColor: Colors.tabBar,
      borderTopColor: Colors.tabIconSelected,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
  },
);

export default createAppContainer(TabNavigator2);
