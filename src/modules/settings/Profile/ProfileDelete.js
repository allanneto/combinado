/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, Keyboard} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {Icon} from 'react-native-elements';

import {Auth, API} from 'aws-amplify';
import {TextInput, Button, Text} from 'react-native-paper';
import {deleteTheUser} from '~/services/authApi';
import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';

class ProfileDelete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      user: null,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Desativar conta',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
      headerLeft: (
        <View style={{marginLeft: 8}}>
          <Icon
            name="chevron-left"
            color={Colors.white}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          />
        </View>
      ),
      headerRight: (
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

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user});
  }

  changeName = name => {
    this.setState(prevState => ({
      error: null,
      email: null,
      password: null,
      user: {
        ...prevState.user,
        name: name,
      },
    }));
  };

  deleteAccount = async () => {
    Keyboard.dismiss();
    if (this.state.email !== this.state.user.email || !this.state.password) {
      this.setState({
        isLoading: false,
        error: 'Erro. Informe o e-mail e a senha da conta para confirmar',
      });
      return;
    }
    this.setState({loading: true});
    try {
      const session = await Auth.currentSession();
      await deleteTheUser(this.state.email, this.state.password);
      const cfg = {
        headers: {Authorization: session.idToken.jwtToken},
      };
      await API.del('user', '/user', cfg);
      this.setState({isLoading: false, error: null});
      this.props.authActions.signOut();
    } catch (err) {
      this.setState({
        isLoading: false,
        error: `Erro na exclusão: ${err.message}`,
      });
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.alertContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.alertText, {fontWeight: 'bold'}]}>
                ATENÇÃO!
              </Text>
              <Text style={styles.alertText}>
                Desativando, seus dados serão perdidos.
              </Text>
              <Text style={styles.alertText}>
                Para confirmar, digite o e-mail da conta e pressione o botão de
                desativação.
              </Text>
              <Text style={styles.alertText}>
                Esta operação não poderá ser revertida.
              </Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              label="Digite o e-mail da conta para confirmar"
              value={this.state.username}
              autoCapitalize={'none'}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text => this.setState({email: text, error: null})}
            />
            <TextInput
              label="Senha"
              value={this.state.password}
              secureTextEntry
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text =>
                this.setState({password: text, error: null})
              }
            />
          </View>
          <View style={styles.cmdContainer}>
            <Button
              mode="contained"
              icon="delete"
              color={Colors.errorBackground}
              loading={this.state.loading}
              onPress={() => this.deleteAccount()}>
              Desativar a conta
            </Button>
          </View>
        </View>
      );
    } else {
      return <Text>Carregando...</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  alertContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.errorBackground,
  },
  textContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  alertText: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 4,
  },
  contentContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  cmdContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileDelete);
