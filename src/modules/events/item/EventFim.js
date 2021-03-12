/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Keyboard,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {updateEvent} from '~/services/eventsApi';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

import Colors from '../../../config/Colors';

class EventFim extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Data/Hora final',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {event, onChange, ro} = this.props.navigation.state.params;
    let fim = event.fim;
    if (!event.fim && event.ini) {
      fim = moment(event.ini).add(2, 'hours');
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      event,
      item: fim,
      onChange,
      ro,
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

  saveValue = () => {
    if (!this.state.item) {
      this.setState({error: 'Data de fim é obrigatória'});
      return;
    }
    const fim = moment(this.state.item);
    if (fim.format() <= moment().format()) {
      this.setState({
        error: 'Data/hora final deve ser maior que a data/hora atual',
      });
      return;
    }
    if (this.state.event.ini) {
      const ini = moment(this.state.event.ini);
      if (ini.format() >= fim.format()) {
        this.setState({
          error: 'Data/hora de início deve ser menor que a data/hora final',
        });
        return;
      }
      const tot = fim.diff(ini, 'hours');
      if (tot > 12) {
        this.setState({
          error: `Evento com duração de ${tot} horas. O máximo deve ser 12 horas`,
        });
        // return
      }
    }

    Keyboard.dismiss();
    this.setState({loading: true});
    const event = {
      userId: this.state.event.userId,
      eventId: this.state.event.eventId,
      fim: this.state.item,
    };
    updateEvent(event)
      .then(() => {
        this.setState({loading: false, error: null});
        this.state.onChange('fim', this.state.item);
        this.props.navigation.state.params.onNavigateBack();
        this.props.navigation.goBack();
        this.props.navigation.navigate('EventLim', {
          event: this.state.event,
          onChange: this.state.onChange,
          ro: this.state.ro,
          onNavigateBack: this.props.navigation.state.params.onNavigateBack,
        });
      })
      .catch(() => {
        this.setState({loading: false, error: 'Erro de gravação'});
      });
  };

  _getDate = () => {
    const dta = moment(this.state.item).toDate();
    return dta;
  };

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    // let dta = moment(date).format("YYYY-MM-DD");
    this.changeValue(date);
    this._hideDateTimePicker();
  };

  shorError = err => {
    this.setState({error: null});
    Alert.alert('Erro', err);
  };

  render() {
    if (this.state.error !== null) {
      this.shorError(this.state.error);
    }
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text>Término do evento</Text>
          </View>
          <View style={styles.contentContainer1}>
            <Text style={{color: Colors.mainColor, marginBottom: 4}}>
              Data/Hora inicial
            </Text>
            {this.state.event.ini ? (
              <Text>
                {moment(this.state.event.ini).format('DD/MM/YYYY HH:mm')}
              </Text>
            ) : (
              <Text>{'Sem data/hora inicial'}</Text>
            )}
          </View>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.pickerStyle}
              onPress={this._showDateTimePicker}>
              <Text style={{color: Colors.mainColor, marginBottom: 4}}>
                Data/Hora final
              </Text>
              {this.state.item ? (
                <Text>
                  {moment(this.state.item).format('DD/MM/YYYY HH:mm')}
                </Text>
              ) : (
                <Text>{'Pressione para escolher data/hora'}</Text>
              )}
            </TouchableOpacity>
            {!this.state.ro ? (
              <DateTimePicker
                date={this._getDate()}
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                titleIOS="Escolha uma data e hora"
                confirmTextIOS="OK"
                locale="pt_BR"
                mode="datetime"
              />
            ) : null}
          </View>
          {!this.state.ro ? (
            <View style={styles.cmdContainer}>
              <Button
                mode="contained"
                icon="system-update-alt"
                loading={this.state.loading}
                onPress={() => this.saveValue()}>
                Salvar
              </Button>
            </View>
          ) : null}
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
  pickerStyle: {
    padding: 8,
    paddingLeft: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBar,
  },
  contentContainer1: {
    backgroundColor: Colors.tabBar,
    padding: 4,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 0,
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

export default connect(mapStateToProps)(EventFim);
