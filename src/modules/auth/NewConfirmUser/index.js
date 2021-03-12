import React from 'react';
import {connect} from 'react-redux';

import {
  View,
  Alert,
  Keyboard,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';

import {resendCode, confirmUser} from '~/services/authApi';

import * as Styled from './styles';

class ConfirmUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      message: null,
      username: this.props.navigation.getParam('username'),
      code: '',
      user: null,
      phaseX: new Animated.Value(0),
      phaseO: new Animated.Value(1),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.phaseX, {
      toValue: -500,
      duration: 0,
    }).start();
    Animated.timing(this.state.phaseO, {
      toValue: 0,
      duration: 500,
    }).start(({finished}) => {
      this.setState({
        phase: this.state.phase + 1,
      });
      Animated.timing(this.state.phaseX, {
        toValue: 500,
        duration: 0,
      }).start();
      Animated.timing(this.state.phaseO, {
        toValue: 1,
        duration: 500,
      }).start();
      Animated.timing(this.state.phaseX, {
        toValue: 0,
        duration: 500,
      }).start();
    });
  }

  onConfirm = async () => {
    Keyboard.dismiss();
    this.setState({loading: true, error: null, message: null});
    try {
      await confirmUser(this.state.username, this.state.code);
      this.setState({loading: false, error: null});
      Animated.timing(this.state.phaseX, {
        toValue: -500,
        duration: 500,
      }).start();
      this.props.navigation.popToTop();
    } catch (err) {
      switch (err.name) {
        case 'CodeMismatchException':
          this.setState({
            loading: false,
            error: 'Código de confirmação inválido',
            message: null,
          });
          break;
        case 'InvalidParameterException':
          this.setState({
            loading: false,
            error: 'Informar email e código',
            message: null,
          });
          break;
        default:
          this.setState({
            loading: false,
            error: 'E-Mail ou código inválidos.',
            message: null,
          });
      }
    }
  };

  onResend = async () => {
    Keyboard.dismiss();
    if (!this.state.username) {
      this.setState({
        loading: false,
        error: 'Não informou o email',
        message: null,
      });
      return;
    }
    try {
      await resendCode(this.state.username);
      this.setState({
        loading: false,
        error: null,
        message: 'Verifique seu email',
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: 'Erro no envio de email' + err.message,
        message: null,
      });
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    } else if (this.state.message !== null) {
      Alert.alert('Código enviado', this.state.message);
    }
    return (
      <Styled.Container
        behavior={Platform.select({
          ios: 'padding',
          android: null,
        })}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />

        <Styled.Header>
          <Styled.HeaderGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#2B1A49', '#503289']}>
            <Styled.FIcon
              onPress={() => this.props.navigation.goBack()}
              name="arrow-left"
              size={30}
            />
            <Styled.HeaderText>Nova conta</Styled.HeaderText>

            <Styled.Image
              source={require('~/assets/images/logo_header.png')}
              resizeMode="contain"
            />
          </Styled.HeaderGradient>
        </Styled.Header>

        <Styled.Content>
          <Styled.TitleBox>
            <Styled.Title>
              Seus dados serão mantidos em sigilo, e sua privacidade será
              mantida.
            </Styled.Title>
          </Styled.TitleBox>

          <Styled.Form
            style={{left: this.state.phaseX, opacity: this.state.phaseO}}>
            <Styled.Input
              editable={false}
              value={this.state.username}
              onChangeText={text =>
                this.setState({username: text, error: null, message: null})
              }
            />
            <Styled.Input
              placeholder="Código recebido"
              maxLength={6}
              keyboardType="number-pad"
              value={this.state.code}
              onChangeText={text =>
                this.setState({code: text, error: null, message: null})
              }
            />
            <Styled.Refresh onPress={() => this.onResend(this.state.username)}>
              <Styled.RefreshIcon name="refresh" size={25} />
              <Styled.Text>SOLICITAR NOVO CÓDIGO</Styled.Text>
            </Styled.Refresh>
          </Styled.Form>
        </Styled.Content>

        <Styled.FooterBox>
          <Styled.FooterImage
            source={require('~/assets/images/confirmado_phone.png')}
            resizeMode="contain"
          />
          <Styled.FooterText>
            <Styled.Title>Seja bem vindo(a) ao </Styled.Title>
            <Styled.BoldText>Combinadoapp.</Styled.BoldText>
          </Styled.FooterText>
        </Styled.FooterBox>

        <View>
          <Styled.Button
            disabled={this.state.code.length !== 6 ? true : false}
            onPress={() =>
              this.onConfirm(this.state.username, this.state.code)
            }>
            <Styled.ButtonGradient
              disabled={this.state.code.length !== 6 ? true : false}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#2B1A49', '#503289']}>
              <Styled.ButtonText>Confirmar cadastro</Styled.ButtonText>
            </Styled.ButtonGradient>
          </Styled.Button>
        </View>
      </Styled.Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(ConfirmUser);
