/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {View, Alert, Keyboard, Text, StatusBar, Platform} from 'react-native';
import {bindActionCreators} from 'redux';

import KeyboardListener from 'react-native-keyboard-listener';

import {Creators as authActions} from '~/redux/ducks/auth';
import {Icon} from 'react-native-elements';

import EyeIcon from 'react-native-vector-icons/Feather';

import * as Styled from './styles';

import {signInUser} from '~/services/authApi';
import Colors from '~/config/Colors';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      username: this.props.username || '',
      password: '',
      logo: true,
      user: null,
      h: 160,
      secure: true,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: '',
      headerStyle: {
        backgroundColor: '#071D3A',
        elevation: 0,
        shadowColor: 'transparent',
      },
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

  onSignIn = async () => {
    Keyboard.dismiss();
    this.setState({loading: true, error: null});
    try {
      await signInUser(this.state.username, this.state.password);
      // const grupos = await userGroups();
      // console.tron.log(grupos);
      this.props.setSessionRequest();
      this.setState({loading: false, error: null});
    } catch (err) {
      switch (err.name) {
        case 'NotAuthorizedException':
        case 'UserNotFoundException':
          this.setState({
            loading: false,
            error: 'Email ou senha inválidos',
          });
          break;
        case 'UserNotConfirmedException':
          this.setState({
            loading: false,
            error: null,
            password: '',
          });
          this.props.navigation.navigate('ConfirmUser', {
            username: this.state.username,
          });
          break;
        case 'InvalidParameterException':
          this.setState({loading: false, error: 'Informar email e senha'});
          break;
        default:
          this.setState({
            loading: false,
            error: 'Erro de conexão. Verifique e-mail e senha',
          });
      }
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    const hmx = 180;
    const hmn = 0;

    return (
      <Styled.Container
        behavior={Platform.select({
          ios: 'padding',
          android: 'padding',
        })}>
        <StatusBar backgroundColor={'#071D3A'} />
        <KeyboardListener
          onDidHide={() => {
            this.setState({h: hmx});
          }}
          onDidShow={() => {
            this.setState({h: hmn});
          }}
        />

        <Styled.Gradient colors={['#071D3A', '#131C4B', '#5D1AAE']}>
          <Styled.Header open={this.state.h}>
            <Styled.Logo source={require('~/assets/images/Logotipo.png')} />
            <Styled.HeaderText>Combinado</Styled.HeaderText>
          </Styled.Header>
          <Styled.Form>
            <Styled.Input
              placeholder="E-Mail"
              value={this.state.username}
              keyboardType={'email-address'}
              autoCapitalize="none"
              onChangeText={text =>
                this.setState({username: text.trim(), error: null})
              }
              onFocus={() => this.setState({h: hmn, error: null})}
              onBlur={() => this.setState({h: hmx, error: null})}
            />
            <Styled.Password>
              <Styled.PasswordInput
                secureTextEntry={this.state.secure ? true : false}
                placeholder="Senha"
                value={this.state.password}
                onChangeText={text =>
                  this.setState({password: text, error: null})
                }
                onFocus={() => this.setState({h: hmn, error: null})}
                onBlur={() => this.setState({h: hmx, error: null})}
              />
              <EyeIcon
                name={this.state.secure ? 'eye' : 'eye-off'}
                size={20}
                color="#49238E"
                onPress={() => this.setState({secure: !this.state.secure})}
              />
            </Styled.Password>
          </Styled.Form>
          <Styled.FooterBox h={this.state.h}>
            <Styled.ForgotText
              onPress={() => {
                this.setState({error: null});
                this.props.navigation.navigate('ForgotPassword');
              }}>
              Esqueci minha senha
            </Styled.ForgotText>
            <Styled.Button
              disabled={this.state.password ? false : true}
              onPress={() =>
                this.onSignIn(this.state.username, this.state.password)
              }>
              <Styled.ButtonGradient
                disabled={this.state.password ? false : true}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#9FFA00', '#F1CD00']}>
                <Text>Conectar</Text>
              </Styled.ButtonGradient>
            </Styled.Button>
            <Styled.ForgotText
              onPress={() => {
                this.setState({error: null});
                this.props.navigation.navigate('SignUp');
              }}>
              Criar conta
            </Styled.ForgotText>
          </Styled.FooterBox>
        </Styled.Gradient>
      </Styled.Container>
    );
  }
}

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
)(SignIn);
