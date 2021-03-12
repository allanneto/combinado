import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import {Button, Text} from 'react-native-paper';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';

class PersonBirth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDateTimePickerVisible: false,
      loading: false,
      error: null,
      user: null,
    };
  }

  componentDidMount() {
    this.setState({user: this.props.auth.user});
  }

  static navigationOptions = {
    title: 'Aniversário',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeValue = bir => {
    this.setState(prevState => ({
      error: null,
      user: {
        ...prevState.user,
        bir: bir,
      },
    }));
  };

  saveValue = async () => {
    Keyboard.dismiss();
    this.setState({loading: true});
    try {
      await updateUser({bir: this.state.user.bir});
      this.props.udateCurrentUser({bir: this.state.user.bir});
      this.setState({loading: false, error: null});
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({loading: false, error: err});
    }
  };

  _getDate = () => {
    const data = this.state.user.bir;
    const dta = data ? new Date(data) : new Date();
    return dta;
  };

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    this._hideDateTimePicker();
    this.changeValue(date);
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.pickerStyle}
              onPress={this._showDateTimePicker}>
              <Text style={{color: Colors.mainColor, marginBottom: 4}}>
                Data de aniversário
              </Text>
              {this.state.user.bir ? (
                <Text>{moment(this.state.user.bir).format('DD/MM/YYYY')}</Text>
              ) : (
                <Text>{'Pressione para escolher a data'}</Text>
              )}
            </TouchableOpacity>

            <DateTimePickerModal
              date={this._getDate()}
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
              titleIOS="Escolha uma data"
              confirmTextIOS="OK"
              locale="pt_BR"
              mode="date"
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
  pickerStyle: {
    padding: 8,
    paddingLeft: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBar,
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
)(PersonBirth);
