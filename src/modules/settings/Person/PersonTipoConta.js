import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, Keyboard, Picker} from 'react-native';
import {Button} from 'react-native-paper';

import Colors from '~/config/Colors';
import {userModel} from '~/config/models';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonTipoConta extends React.Component {
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
    title: 'Tipo de conta',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeTct = tct => {
    this.setState(prevState => ({
      error: null,
      user: {
        ...prevState.user,
        tct: tct,
      },
    }));
  };

  saveValue = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    try {
      await updateUser({tct: this.state.user.tct});
      this.props.udateCurrentUser({tct: this.state.user.tct});
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
            <Picker
              selectedValue={this.state.user.tct}
              onValueChange={itemValue => this.changeTct(itemValue)}>
              <Picker.Item label="Escolha uma opção" value="" />
              {userModel.tct.map(tct => (
                <Picker.Item label={tct.text} value={tct.value} key={tct.key} />
              ))}
            </Picker>
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonTipoConta);
