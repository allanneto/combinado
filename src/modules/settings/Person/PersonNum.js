/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, Keyboard} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonNum extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      user: null,
    };
  }

  componentDidMount() {
    this.setState({user: this.props.auth.user});
  }

  static navigationOptions = {
    title: 'Alterar numero do endereço',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeValue = value => {
    this.setState(prevState => ({
      error: null,
      user: {
        ...prevState.user,
        num: value,
      },
    }));
  };

  saveValue = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    try {
      await updateUser({num: this.state.user.num});
      this.props.udateCurrentUser({num: this.state.user.num});
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
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TextInput
              label="Número"
              value={this.state.user.num}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text => this.changeValue(text)}
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
)(PersonNum);
