/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, Keyboard} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {Icon} from 'react-native-elements';
import {TextInput, Button, Text} from 'react-native-paper';

import Colors from '~/config/Colors';
import {changeCurrentPassword} from '~/services/authApi';

class ProfilePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      message: null,
      password: null,
      password2: null,
      newPassword: null,
      user: null,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user});
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Alterar senha',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
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

  changeName = name => {
    this.setState(prevState => ({
      error: null,
      message: null,
      user: {
        ...prevState.user,
        name: name,
      },
    }));
  };

  savePassword = async () => {
    Keyboard.dismiss();
    if (this.state.newPassword !== this.state.newPassword2) {
      this.setState({
        loading: false,
        error: 'Senha repetida não confere com a primeira',
        message: null,
      });
      return;
    }
    this.setState({loading: true});
    try {
      await changeCurrentPassword(this.state.password, this.state.newPassword);
      this.setState({
        loading: false,
        error: null,
        message: 'Senha atualizada com sucesso',
      });
      this.props.navigation.navigate('Exit');
    } catch (err) {
      switch (err.name) {
        case 'NotAuthorizedException':
          this.setState({
            loading: false,
            error: 'Senha atual errada',
            message: null,
          });
          break;
        case 'InvalidParameterException':
          if (this.state.password && this.state.newPassword) {
            this.setState({
              loading: false,
              error: 'Senha deve ter no mínimo 6 caracteres',
              message: null,
            });
          } else {
            this.setState({
              loading: false,
              error: 'Informar s senha atual e a nova',
              message: null,
            });
          }
          break;
        default:
          this.setState({
            loading: false,
            error: 'Erro de gravação',
            message: null,
          });
      }
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    } else if (this.state.message !== null) {
      Alert.alert('Senha alterada', this.state.message);
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TextInput
              label="Senha atual"
              value={this.state.password}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              secureTextEntry
              onChangeText={text =>
                this.setState({password: text, error: null})
              }
            />
            <TextInput
              label="Nova senha"
              value={this.state.newPassword}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              secureTextEntry
              onChangeText={text =>
                this.setState({newPassword: text, error: null})
              }
            />
            <TextInput
              label="Repetir nova senha"
              value={this.state.newPassword2}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              secureTextEntry
              onChangeText={text =>
                this.setState({newPassword2: text, error: null})
              }
            />
          </View>

          <View style={styles.cmdContainer}>
            <Button
              mode="contained"
              icon="check"
              loading={this.state.loading}
              onPress={() => this.savePassword()}>
              Alterar
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
  contentContainer: {
    marginLeft: 16,
    marginRight: 16,
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

export default connect(mapStateToProps)(ProfilePassword);
