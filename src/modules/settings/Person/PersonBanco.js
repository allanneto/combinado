import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert, Picker} from 'react-native';

import {Button, Text} from 'react-native-paper';

import {userModel} from '~/config/models';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonBanco extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Banco',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    this.setState({
      item: this.props.auth.user.ban,
      banks: userModel.banks,
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
    this.setState({loading: true});
    try {
      await updateUser({ban: this.state.item});
      this.props.udateCurrentUser({ban: this.state.item});
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
            <Text>Banco</Text>
            <Picker
              selectedValue={this.state.item}
              onValueChange={itemValue => this.changeValue(itemValue)}>
              <Picker.Item label="Escolha uma opção" value="" />
              {this.state.banks.map(gen => (
                <Picker.Item label={gen.text} value={gen.key} key={gen.key} />
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
)(PersonBanco);
