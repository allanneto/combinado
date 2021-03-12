import React from 'react';
import {connect} from 'react-redux';
import {Alert, Keyboard, Platform} from 'react-native';

import KeyboardListener from 'react-native-keyboard-listener';

import {forgotPassword} from '~/services/authApi';
import Colors from '~/config/Colors';

import * as Styled from './styles';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      username: this.props.username || '',
      code: '',
      user: null,
      open: false,
    };
  }

  static navigationOptions = {
    title: 'Esqueci a senha',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  onConfirm = async () => {
    Keyboard.dismiss();
    this.setState({loading: true, error: null});
    try {
      await forgotPassword(this.state.username);
      this.setState({loading: false, error: null});
      this.props.navigation.navigate('ChangePassword', {
        username: this.state.username,
      });
    } catch (err) {
      switch (err.name) {
        case 'InvalidParameterException':
          this.setState({loading: false, error: 'Informar email'});
          break;
        default:
          this.setState({loading: false, error: 'E-mail inválido'});
      }
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }

    return (
      <Styled.Container
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}>
        <KeyboardListener
          onDidHide={() => {
            this.setState({open: false});
          }}
          onDidShow={() => {
            this.setState({open: true});
          }}
        />

        <Styled.Header>
          <Styled.FIcon
            onPress={() => this.props.navigation.goBack()}
            name="arrow-left"
            size={30}
          />
          <Styled.Image
            open={this.state.open}
            source={require('~/assets/images/header_people.png')}
          />
          <Styled.HeaderImage>
            <Styled.Image1
              source={require('~/assets/images/fundo_ondulado.png')}
            />
            <Styled.Image2 source={require('~/assets/images/pontilhado.png')} />
          </Styled.HeaderImage>
        </Styled.Header>
        <Styled.ContentBox>
          <Styled.Title>Recuperar Senha</Styled.Title>
          <Styled.Title2>
            Informe seu e-mail para receber o código de autorização.
          </Styled.Title2>
          <Styled.Input
            value={this.state.username}
            autoCapitalize="none"
            placeholder="Informe seu e-mail"
            keyboardType={'email-address'}
            onFocus={() => this.setState({open: true})}
            onChangeText={text =>
              this.setState({username: text.trim(), error: null})
            }
          />
        </Styled.ContentBox>

        <Styled.Footer>
          <Styled.Background
            source={require('~/assets/images/base_ondulada.png')}>
            <Styled.Button
              disabled={this.state.username ? false : true}
              onPress={() => this.onConfirm(this.state.username)}>
              <Styled.ButtonGradient
                disabled={this.state.username ? false : true}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#2B1A49', '#503289']}>
                <Styled.ButtonText>Solicitar Código</Styled.ButtonText>
              </Styled.ButtonGradient>
            </Styled.Button>
          </Styled.Background>
        </Styled.Footer>
      </Styled.Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(ForgotPassword);
