import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Text, View, Alert, Keyboard} from 'react-native';

import {TextInput, Button} from 'react-native-paper';

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
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text>Informe o e-mail, o código recebido e a nova senha</Text>
        </View>
        <View style={styles.signInForm}>
          <TextInput
            label="E-Mail"
            value={this.state.username}
            style={{marginBottom: 8, backgroundColor: 'white'}}
            keyboardType={'email-address'}
            onChangeText={text =>
              this.setState({username: text.trim(), error: null})
            }
          />
          <TextInput
            label="Código recebido"
            value={this.state.code}
            style={{marginBottom: 8, backgroundColor: 'white'}}
            onChangeText={text => this.setState({code: text, error: null})}
          />
          <TextInput
            label="Senha"
            value={this.state.password}
            secureTextEntry
            style={{marginBottom: 8, backgroundColor: 'white'}}
            onChangeText={text => this.setState({password: text, error: null})}
          />
          <TextInput
            label="Repetir senha"
            value={this.state.password2}
            secureTextEntry
            style={{marginBottom: 8, backgroundColor: 'white'}}
            onChangeText={text => this.setState({password2: text, error: null})}
          />

          <View style={styles.cmdContainer}>
            <Button
              mode="contained"
              icon="check"
              loading={this.state.loading}
              onPress={() =>
                this.onConfirm(
                  this.state.username,
                  this.state.password,
                  this.state.code,
                )
              }>
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cmdContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signInForm: {
    marginTop: 10,
    marginLeft: '5%',
    marginRight: '5%',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(ChangePassword);
