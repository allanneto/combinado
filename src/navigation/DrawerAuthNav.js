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
import amplifyConfig from '~/config/amplifyConfig';

import ProfileAuthHeader from './ProfileAuthHeader';
import AuthNavigator from './AuthNavigator';
import CentralScreenNavigator from '~/navigation/routes/CentralScreenNavigator';
import UsersScreenNavigator from '~/navigation/routes/UsersScreenNavigator';
import VagasScreenNavigator from './routes/VagasScreenNavigator';

const DrawerAuthNav = createDrawerNavigator(
  {
    Auth: {
      screen: AuthNavigator,
    },
    Central: {
      screen: CentralScreenNavigator,
    },
    Users: {
      screen: UsersScreenNavigator,
    },
    Vagas: {
      screen: VagasScreenNavigator,
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
              <ProfileAuthHeader nav={props} />
            </View>
            <Drawer.Section>
              <Drawer.Item
                label="Meu perfil"
                icon="account"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Trocar senha"
                icon="fingerprint"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item label="Financeiro" style={styles.section} />
              <Drawer.Item
                label="Conta corrente"
                icon="currency-usd"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Transferências"
                icon="cash-refund"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
            </Drawer.Section>
            <Drawer.Section>
              <Drawer.Item label="Contratar" style={styles.section} />
              <Drawer.Item
                label="Prestadores"
                icon="account-multiple"
                onPress={() => props.navigation.navigate('Users')}
              />
              <Drawer.Item
                label="Avaliações pendentes"
                icon="star"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Solicitações pendentes"
                icon="inbox"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Minhas avaliações"
                icon="star-outline"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
            </Drawer.Section>

            <Drawer.Section>
              <Drawer.Item label="Quero trabalhar" style={styles.section} />
              <Drawer.Item
                label="Vagas"
                icon="feature-search-outline"
                onPress={() => props.navigation.navigate('Vagas')}
              />
              <Drawer.Item
                label="Minha agenda"
                icon="calendar-range"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Minhas avaliações"
                icon="star-outline"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Minhas especialidades"
                icon="playlist-check"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
            </Drawer.Section>

            <Drawer.Section>
              <Drawer.Item
                label="Preferencias"
                icon="tune"
                onPress={() => Alert.alert('Conecte-se para acessar')}
              />
              <Drawer.Item
                label="Central de atendimento"
                icon="voice"
                onPress={() => props.navigation.navigate('Central')}
              />
              <Drawer.Item
                label="Desativar conta"
                icon="account-off"
                onPress={() => Alert.alert('Conecte-se para acessar')}
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

export default createAppContainer(DrawerAuthNav);
