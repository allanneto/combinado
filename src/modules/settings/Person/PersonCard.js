import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert} from 'react-native';

import {Button} from 'react-native-paper';

import {CreditCardInput} from 'react-native-credit-card-input';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: null,
      values: null,
    };
  }

  static navigationOptions = {
    title: 'Cartão de crédito',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    this.setState({
      loaded: true,
      error: null,
    });
  }

  handleValue = form => {
    this.setState({
      error: null,
      valid: form.valid,
      values: {
        crn: form.values.number,
        crv: form.values.expiry,
        crb: form.values.type,
        crs: form.values.cvc,
        crh: form.values.name,
      },
    });
  };

  saveValue = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    try {
      await updateUser(this.state.values);
      this.props.udateCurrentUser(this.state.values);
      this.setState({loading: false, error: null});
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: 'Dados inválidos do cartão'});
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
            <CreditCardInput
              onChange={this.handleValue}
              ref={c => (this.CCInput = c)}
              labels={{
                number: 'NUMERO',
                expiry: 'EXPIRA',
                cvc: 'CVC/CCV',
                name: 'NOME NO CARTÃO',
              }}
              requiresName
            />
          </View>
          <View style={styles.cmdContainer}>
            <Button
              mode="contained"
              icon="check"
              loading={this.state.loading}
              onPress={() => this.saveValue()}>
              Salvar
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
    marginLeft: 4,
    marginRight: 4,
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
)(PersonCard);
