/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert} from 'react-native';

import {TextInput, Button} from 'react-native-paper';
import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonConta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Conta',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    this.setState({
      item: this.props.auth.user.cta,
      ban: this.props.auth.user.ban,
      loaded: true,
      error: null,
    });
  }

  changeValue = value => {
    this.setState({
      item: value,
      error: null,
    });
  };

  saveValue = async () => {
    Keyboard.dismiss();
    if (!this.state.ban) {
      this.setState({error: 'Informe o banco primeiro'});
      return;
    }
    let re = /\d{5,}\-\d+/;
    if (this.state.ban === '104') {
      re = /\d{3}\d{5,}\-\d+/;
    }
    if (!re.test(this.state.item)) {
      this.setState({error: 'Formato inválido da conta'});
      this.setState({loading: false});
      return;
    }
    this.setState({loading: true});
    try {
      await updateUser({cta: this.state.item});
      this.props.udateCurrentUser({cta: this.state.item});
      this.setState({loading: false, error: null});
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: err.message});
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TextInput
              label="Conta"
              style={{marginBottom: 8, backgroundColor: 'white'}}
              value={this.state.item}
              onChangeText={text => this.changeValue(text)}
            />
          </View>
          <View style={styles.cmdContainer}>
            <Button
              mode="contained"
              icon="check"
              loading={this.state.loading}
              onPress={() => this.saveValue()}>
              Confirmar
            </Button>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(authActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonConta);
