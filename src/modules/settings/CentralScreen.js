/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {Text, ListItem, Icon} from 'react-native-elements';

import Colors from '~/config/Colors';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import LinearGradient from 'react-native-linear-gradient';
import {sendEmail} from '~/services/sendEmail';

const EMAIL_CENTRAL = 'contato@combinadoapp.com.br';
const EMAIL_TITLE = 'Central de atendimento';

class CentralScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Central de Atendimento',
      headerStyle: {
        backgroundColor: '#0D3E5B',
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTintColor: Colors.white,
      headerLeft: () => (
        <View style={{marginLeft: 8}}>
          <Icon
            name="chevron-left"
            color={Colors.white}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          />
        </View>
      ),
      headerRight: () => (
        <View style={{marginRight: 8}}>
          <Icon
            name="menu"
            color={Colors.white}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>
      ),
    };
  };

  sendMail() {
    sendEmail(EMAIL_CENTRAL, EMAIL_TITLE, '').then(() => {
      console.log('Mensagem enviada');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.marcaContainer}>
          <View style={styles.logoContainer}>
            <LinearGradient colors={['#0D3E5B', '#000102']}>
              <Image
                style={{
                  flex: 1,
                  resizeMode: 'contain',
                }}
                source={require('~/assets/images/logo_combinado_branco.png')}
              />
            </LinearGradient>
          </View>
        </View>
        <View style={styles.helpContainer}>
          <Text style={styles.helpText1}>Está com dúvidas?</Text>
          <Text style={styles.helpText}>
            Não consegue resolver um problema?
          </Text>
          <Text style={styles.helpText}>Quer saber mais sobre o app?</Text>
          <Text style={styles.helpText}>
            Entre em contato com a nossa equipe!
          </Text>
        </View>
        <ScrollView style={{flex: 1}}>
          <ListItem
            leftIcon={
              <Icon
                raised
                size={18}
                name="help"
                type="material-community"
                color="#ff6600"
              />
            }
            bottomDivider
            title="Perguntas frequentes"
            onPress={() => this.props.navigation.navigate('FAQ')}
          />
          <ListItem
            leftIcon={
              <Icon
                raised
                size={18}
                name="mail-outline"
                type="material-icons"
                color="#ff6600"
              />
            }
            containerStyle={{marginTop: 16}}
            bottomDivider
            title={EMAIL_CENTRAL}
            onPress={() => this.sendMail()}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    backgroundColor: '#000102',
  },
  marcaContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 140,
    backgroundColor: Colors.mainColor,
  },
  helpContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
  },
  helpText1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#707070',
  },
  helpText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#707070',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(authActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CentralScreen);
