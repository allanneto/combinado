/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {Alert, Keyboard, StatusBar, Animated} from 'react-native';

import validateEmail from '~/util/validateEmail';

import {subYears, parseISO} from 'date-fns';

import * as Styled from './styles';

import {signUpUser} from '~/services/authApi';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      username: '',
      name: '',
      cel: '',
      sur: '',
      bir: '',
      gen: '',
      password1: '',
      password2: '',
      user: null,
      phase: 1,
      phase1X: new Animated.Value(0),
      phase1O: new Animated.Value(1),
    };
  }

  onSignUp = () => {
    Keyboard.dismiss();

    const confirm = validateEmail(this.state.username);

    if (!confirm) {
      return Alert.alert('Por favor insira um email válido.');
    }

    if (!this.state.username || !this.state.name || !this.state.password1) {
      this.setState({
        loading: false,
        error: 'Preencher todos os campos',
      });
      return;
    }

    if (this.state.password1.length < 6) {
      this.setState({
        loading: false,
        error: 'Senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    if (this.state.password1 !== this.state.password2) {
      this.setState({
        loading: false,
        error: 'Senhas não batem. Repita a mesma senha',
      });
      return;
    }

    if (subYears(new Date(), 16) < parseISO(this.state.bir)) {
      this.setState({
        loading: false,
        error:
          'Você deve ter no mínimo 16 anos para se cadastrar na aplicação.',
      });
      return;
    }

    this.setState({loading: true, error: null});
    signUpUser(
      this.state.username,
      this.state.name,
      this.state.password1,
      this.state.sur,
      this.state.bir,
      this.state.gen,
      this.state.cel,
    )
      .then(() => {
        this.setState({loading: false, error: null});
        this.props.navigation.popToTop();
        this.props.navigation.navigate('ConfirmUser', {
          username: this.state.username,
        });
      })
      .catch(err => {
        switch (err.name) {
          case 'UsernameExistsException':
            this.setState({
              loading: false,
              error: 'Usuário já existe com esse email',
            });
            break;
          default:
            this.setState({
              loading: false,
              error: `Erro de conexão: ${JSON.stringify(err)}`,
            });
        }
      });
  };

  onSwitchPhase = async () => {
    if (this.state.phase !== 3) {
      Animated.timing(this.state.phase1X, {
        toValue: -500,
        duration: 500,
      }).start();

      Animated.timing(this.state.phase1O, {
        toValue: 0,
        duration: 500,
      }).start(({finished}) => {
        this.setState({
          phase: this.state.phase + 1,
        });

        Animated.timing(this.state.phase1X, {
          toValue: 500,
          duration: 0,
        }).start();

        Animated.timing(this.state.phase1O, {
          toValue: 1,
          duration: 500,
        }).start();

        Animated.timing(this.state.phase1X, {
          toValue: 0,
          duration: 500,
        }).start();
      });
    } else {
      this.onSignUp();
    }
  };

  onReturnPhase = () => {
    if (this.state.phase !== 1) {
      Animated.timing(this.state.phase1X, {
        toValue: 500,
        duration: 500,
      }).start();

      Animated.timing(this.state.phase1O, {
        toValue: 0,
        duration: 500,
      }).start(({finished}) => {
        this.setState({
          phase: this.state.phase - 1,
        });

        Animated.timing(this.state.phase1X, {
          toValue: -500,
          duration: 0,
        }).start();

        Animated.timing(this.state.phase1O, {
          toValue: 1,
          duration: 500,
        }).start();

        Animated.timing(this.state.phase1X, {
          toValue: 0,
          duration: 500,
        }).start();
      });
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }

    return (
      <Styled.Container>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <Styled.Header>
          <Styled.HeaderGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#2B1A49', '#503289']}>
            <Styled.FIcon
              onPress={() => this.onReturnPhase()}
              name="arrow-left"
              size={30}
            />
            <Styled.Text>Nova conta</Styled.Text>

            <Styled.Image2
              source={require('~/assets/images/logo_header.png')}
              resizeMode="contain"
            />
          </Styled.HeaderGradient>
        </Styled.Header>

        <Styled.TitleBox>
          <Styled.Title>
            Seus dados serão mantidos em sigilo, e sua privacidade será mantida.
          </Styled.Title>
        </Styled.TitleBox>
        <Styled.Content>
          <Styled.Phase1
            style={{left: this.state.phase1X, opacity: this.state.phase1O}}
            phase={this.state.phase}>
            <Styled.Input
              placeholder="Nome"
              value={this.state.name}
              onChangeText={text => this.setState({name: text, error: null})}
            />

            <Styled.Input
              placeholder="Sobrenome"
              value={this.state.sur}
              autoCapitalize="none"
              onChangeText={text => this.setState({sur: text, error: null})}
            />

            <Styled.DateBox>
              <Styled.DateInput
                placeholder="Data de nascimento"
                date={this.state.bir}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirmar"
                cancelBtnText="Cancelar"
                customStyles={{
                  dateInput: {
                    backgroundColor: '#fff',
                    borderColor: '#fff',
                    alignItems: 'flex-start',
                  },
                  dateText: {
                    color: '#808080',
                    textAlign: 'left',
                    paddingLeft: 0,
                  },
                  placeholderText: {
                    color: '#808080',
                    textAlign: 'left',
                    paddingLeft: 0,
                    fontSize: 15,
                  },
                }}
                onDateChange={date => {
                  if (subYears(new Date(), 16) < parseISO(date)) {
                    return Alert.alert(
                      'Você deve ter no mínimo 16 anos para se cadastrar na aplicação.',
                    );
                  }

                  this.setState({bir: date});
                }}
              />
            </Styled.DateBox>
          </Styled.Phase1>

          <Styled.Phase2
            style={{left: this.state.phase1X, opacity: this.state.phase1O}}
            phase={this.state.phase}>
            <Styled.Select
              selectedValue={this.state.gen}
              onValueChange={itemValue => this.setState({gen: itemValue})}
              placeholder="Gênero"
              value={this.state.gen}
              autoCapitalize="none"
              onChangeText={text => this.setState({gen: text, error: null})}>
              <Styled.Select.Item label="Gênero:" value={null} />
              <Styled.Select.Item label="Masculino" value="M" />
              <Styled.Select.Item label="Feminino" value="F" />
            </Styled.Select>

            <Styled.PhoneInput
              type="cel-phone"
              placeholder="Celular"
              value={this.state.cel}
              maxLength={15}
              autoCapitalize="none"
              onChangeText={text => this.setState({cel: text, error: null})}
            />
          </Styled.Phase2>

          <Styled.Phase3
            style={{left: this.state.phase1X, opacity: this.state.phase1O}}
            phase={this.state.phase}>
            <Styled.Input
              placeholder="E-Mail"
              value={this.state.username}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={text => {
                this.setState({username: text.trim(), error: null});
              }}
            />

            <Styled.Input
              placeholder="Senha"
              value={this.state.password1}
              secureTextEntry
              onChangeText={text =>
                this.setState({password1: text, error: null})
              }
            />

            <Styled.Input
              placeholder="Repetir a senha"
              value={this.state.password2}
              secureTextEntry
              onChangeText={text =>
                this.setState({password2: text, error: null})
              }
            />
          </Styled.Phase3>

          <Styled.FooterBox>
            <Styled.FooterImage
              source={require('~/assets/images/colaboradores.png')}
              resizeMode="contain"
            />

            <Styled.PhasesBox>
              <Styled.PhaseIdentifier
                filled={this.state.phase >= 1 ? true : false}
              />
              <Styled.PhaseIdentifier
                filled={this.state.phase >= 2 ? true : false}
              />
              <Styled.PhaseIdentifier
                filled={this.state.phase === 3 ? true : false}
              />
            </Styled.PhasesBox>

            <Styled.Button
              disabled={
                this.state.phase === 1
                  ? this.state.name && this.state.sur && this.state.bir
                    ? false
                    : true
                  : this.state.phase === 2
                  ? this.state.gen && this.state.cel
                    ? false
                    : true
                  : this.state.username &&
                    this.state.password1 &&
                    this.state.password2
                  ? false
                  : true
              }
              onPress={() => {
                this.onSwitchPhase();
              }}>
              <Styled.ButtonGradient
                disabled={
                  this.state.phase === 1
                    ? this.state.name && this.state.sur && this.state.bir
                      ? false
                      : true
                    : this.state.phase === 2
                    ? this.state.gen && this.state.cel
                      ? false
                      : true
                    : this.state.username &&
                      this.state.password1 &&
                      this.state.password2
                    ? false
                    : true
                }
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#2B1A49', '#503289']}>
                <Styled.ButtonText>
                  {this.state.phase !== 3 ? 'Próximo' : 'Cadastrar'}
                </Styled.ButtonText>
              </Styled.ButtonGradient>
            </Styled.Button>
          </Styled.FooterBox>
        </Styled.Content>
      </Styled.Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(SignUp);
