import React from 'react';
import {StyleSheet} from 'react-native';

import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createAppContainer} from 'react-navigation';

import {Icon} from 'react-native-elements';
import Colors from '../config/Colors';
import WorkScreenNavigator from './routes/WorkScreenNavigator';
import VagasScreenNavigator from './routes/VagasScreenNavigator';
import NotificationsScreenNavigator from './routes/NotificationsScreenNavigator';
import MessagesScreenNavigator from './routes/MessagesScreenNavigator';

const TabNavigator1 = createMaterialBottomTabNavigator(
  {
    Vagas: {
      screen: VagasScreenNavigator,
      navigationOptions: {
        title: 'Vagas',
        tabBarIcon: ({focused}) => (
          <Icon
            name={'search'}
            type={'material'}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        ),
      },
    },
    Work: {
      screen: WorkScreenNavigator,
      navigationOptions: {
        title: 'Trabalhos',
        tabBarIcon: ({focused}) => (
          <Icon
            name={'star'}
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
            name={'comment-multiple-outline'}
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

export default createAppContainer(TabNavigator1);
