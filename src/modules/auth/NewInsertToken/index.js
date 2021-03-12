import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Alert, Keyboard, Platform} from 'react-native';

import KeyboardListener from 'react-native-keyboard-listener';

import * as Styled from './styles';

import {confirmPassword} from '~/services/authApi';
import Colors from '~/config/Colors';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      username: this.props.navigation.getParam('username', ''),
      code: '',
      password: '',
      password2: '',
      user: null,
      token: false,
    };
  }

  static navigationOptions = {
    title: 'Criar nova senha',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  onConfirm = async () => {
    Keyboard.dismiss();
    if (
      !this.state.username ||
      !this.state.code ||
      !this.state.password ||
      !this.state.password2
    ) {
      this.setState({
        loading: false,
        error: 'Preencher todos os campos',
      });
      return;
    }
    if (this.state.password.length < 6) {
      this.setState({
        loading: false,
        error: 'Senha deve ter no mínimo 6 caracteres',
      });
      return;
    }
    if (this.state.password !== this.state.password2) {
      this.setState({
        loading: false,
        error: 'Senha repetida não confere com a primeira',
      });
      return;
    }
    this.setState({loading: true, error: null});
    try {
      await confirmPassword(
        this.state.username,
        this.state.password,
        this.state.code,
      );
      this.setState({loading: false, error: null});
      this.props.navigation.popToTop();
    } catch (err) {
      this.setState({loading: false, error: err});
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
          <Styled.TokenBox visible={!this.state.token ? true : false}>
            <Styled.Title>Recuperar Senha</Styled.Title>
            <Styled.Input
              editable={false}
              value={this.state.username}
              keyboardType={'email-address'}
              onChangeText={text =>
                this.setState({username: text.trim(), error: null})
              }
            />
            <Styled.Input
              placeholder="Código recebido"
              keyboardType="number-pad"
              value={this.state.code}
              maxLength={6}
              onChangeText={text => this.setState({code: text, error: null})}
            />
          </Styled.TokenBox>
          <Styled.PasswordBox visible={!this.state.token ? false : true}>
            <Styled.Title>Redefinir Senha</Styled.Title>
            <Styled.Input
              placeholder="Senha"
              value={this.state.password}
              secureTextEntry
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text =>
                this.setState({password: text, error: null})
              }
            />
            <Styled.Input
              placeholder="Repetir senha"
              value={this.state.password2}
              secureTextEntry
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text =>
                this.setState({password2: text, error: null})
              }
            />
          </Styled.PasswordBox>
        </Styled.ContentBox>
        <Styled.Footer>
          <Styled.Background
            source={require('~/assets/images/base_ondulada.png')}>
            <Styled.Button
              visible={!this.state.token ? true : false}
              onPress={() =>
                this.setState({
                  token: true,
                })
              }>
              <Styled.ButtonGradient
                disabled={this.state.code ? false : true}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#2B1A49', '#503289']}>
                <Styled.ButtonText>Confirmar</Styled.ButtonText>
              </Styled.ButtonGradient>
            </Styled.Button>
            <Styled.Button
              visible={!this.state.token ? false : true}
              onPress={() =>
                this.onConfirm(
                  this.state.username,
                  this.state.password,
                  this.state.code,
                )
              }>
              <Styled.ButtonGradient
                disabled={this.state.password2 ? false : true}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#2B1A49', '#503289']}>
                <Styled.ButtonText>Confirmar</Styled.ButtonText>
              </Styled.ButtonGradient>
            </Styled.Button>
          </Styled.Background>
        </Styled.Footer>
      </Styled.Container>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {},
  container: {},
  cmdContainer: {},
  signInForm: {},
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(ChangePassword);
