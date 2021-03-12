import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Platform,
  Text,
  Alert,
} from 'react-native';
import {getStatusBarHeight} from '~/services/getStatusBarHeight';
import {createAppContainer, SafeAreaView} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {Drawer, Colors} from 'react-native-paper';
import FocusNavigator from './FocusNavigator';
import amplifyConfig from '~/config/amplifyConfig';

import ProfileHeader from './ProfileHeader';
import ProfileScreenNavigator from '~/navigation/routes/ProfileScreenNavigator';
import PersonScreenNavigator from '~/navigation/routes/PersonScreenNavigator';
import PasswordScreenNavigator from '~/navigation/routes/PasswordScreenNavigator';
import DeleteScreenNavigator from '~/navigation/routes/DeleteScreenNavigator';
import SkillsScreenNavigator from '~/navigation/routes/SkillsScreenNavigator';
import UserDataScreenNavigator from '~/navigation/routes/UserDataScreenNavigator';
import CentralScreenNavigator from '~/navigation/routes/CentralScreenNavigator';
import ExitScreenNavigator from '~/navigation/routes/ExitScreenNavigator';
import AccountBookNavigator from '~/navigation/routes/AccountBookNavigator';
import AccountWithdrawNavigator from '~/navigation/routes/AccountWithdrawNavigator';

const BUILDING = 'Em breve';

const DrawerNav = createDrawerNavigator(
  {
    WorkFocus: {
      screen: FocusNavigator,
    },
    Profile: {
      screen: ProfileScreenNavigator,
    },
    Person: {
      screen: PersonScreenNavigator,
    },
    Password: {
      screen: PasswordScreenNavigator,
    },
    DeleteAccount: {
      screen: DeleteScreenNavigator,
    },
    Skills: {
      screen: SkillsScreenNavigator,
    },
    AccountBook: {
      screen: AccountBookNavigator,
    },
    AccountWithdraw: {
      screen: AccountWithdrawNavigator,
    },
    Central: {
      screen: CentralScreenNavigator,
    },
    Exit: {
      screen: ExitScreenNavigator,
    },
    User: {
      screen: UserDataScreenNavigator,
    },
  },
  {
    overlayColor: '#00000099',
    contentComponent: props => {
      return (
        <ScrollView>
          <SafeAreaView
            style={styles.safe}
            forceInset={{top: 'always', horizontal: 'never'}}>
            <View style={styles.header}>
              <ProfileHeader nav={props} />
            </View>
            <Drawer.Section>
              <Drawer.Item
                label="Meu perfil"
                icon="account"
                onPress={() => props.navigation.navigate('Person')}
              />
              <Drawer.Item
                label="Trocar senha"
                icon="fingerprint"
                onPress={() => props.navigation.navigate('Password')}
              />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item label="Financeiro" style={styles.section} />
              <Drawer.Item
                label="Conta corrente"
                icon="currency-usd"
                onPress={() => props.navigation.navigate('AccountBook')}
              />
              <Drawer.Item
                label="Transferências"
                icon="cash-refund"
                onPress={() => props.navigation.navigate('AccountWithdraw')}
              />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item label="Contratar" style={styles.section} />
              <Drawer.Item
                label="Avaliações pendentes"
                icon="star"
                onPress={() => Alert.alert(BUILDING)}
              />
              <Drawer.Item
                label="Solicitações pendentes"
                icon="inbox"
                onPress={() => Alert.alert(BUILDING)}
              />
              <Drawer.Item
                label="Minhas avaliações"
                icon="star-outline"
                onPress={() => Alert.alert(BUILDING)}
              />
            </Drawer.Section>

            <Drawer.Section>
              <Drawer.Item label="Quero trabalhar" style={styles.section} />
              <Drawer.Item
                label="Minha agenda"
                icon="calendar-range"
                onPress={() => Alert.alert(BUILDING)}
              />
              <Drawer.Item
                label="Minhas avaliações"
                icon="star-outline"
                onPress={() => props.navigation.navigate('User')}
              />
              <Drawer.Item
                label="Minhas especialidades"
                icon="playlist-check"
                onPress={() => props.navigation.navigate('Skills')}
              />
            </Drawer.Section>

            <Drawer.Section>
              <Drawer.Item
                label="Preferencias"
                icon="tune"
                onPress={() => Alert.alert(BUILDING)}
              />
              <Drawer.Item
                label="Central de atendimento"
                icon="voice"
                onPress={() => props.navigation.navigate('Central')}
              />
              <Drawer.Item
                label="Desativar conta"
                icon="account-off"
                onPress={() => props.navigation.navigate('DeleteAccount')}
              />
              <Drawer.Item
                label="Sair"
                icon="power"
                onPress={() => props.navigation.navigate('Exit')}
              />
            </Drawer.Section>
            <View style={styles.footer}>
              <Text>Informações</Text>
              <Text style={styles.verText}>ver.{amplifyConfig.version}</Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      );
    },
  },
);

const styles = StyleSheet.create({
  header: {
    height: 90,
    flex: 1,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.blueGrey100,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  safe: {
    marginTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  footer: {
    height: 40,
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verText: {
    fontSize: 11,
    // fontWeight: 'bold',
    color: Colors.lightColor,
  },
  section: {
    backgroundColor: Colors.blueGrey100,
  },
});

export default createAppContainer(DrawerNav);
