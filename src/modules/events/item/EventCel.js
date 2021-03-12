/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert, Text} from 'react-native';
import {updateEvent} from '~/services/eventsApi';
import {TextInput, Button} from 'react-native-paper';
// import TextInputMask from 'react-native-text-input-mask'

import Colors from '../../../config/Colors';

class EventCel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Celular de contato',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {event, onChange, ro} = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      event,
      item: event.cel || null,
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
      this.setState({error: 'Numero de celular obrigatória'});
      return;
    }
    Keyboard.dismiss();
    this.setState({loading: true});
    const event = {
      userId: this.state.event.userId,
      eventId: this.state.event.eventId,
      cel: this.state.item,
    };
    updateEvent(event)
      .then(() => {
        this.setState({loading: false, error: null});
        this.state.onChange('cel', this.state.item);
        this.props.navigation.state.params.onNavigateBack();
        this.props.navigation.goBack();
      })
      .catch(() => {
        this.setState({loading: false, error: 'Erro de gravação'});
      });
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text>Celular do organizador</Text>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              label="Numero do celular Contato"
              value={this.state.item}
              disabled={this.state.ro}
              style={{marginBottom: 8, backgroundColor: 'white'}}
              onChangeText={text => this.changeValue(text)}
              // render={props => <TextInputMask {...props} mask='([00]) [00009]-[0000]' />}
            />
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
    // alignItems: "center",
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

export default connect(mapStateToProps)(EventCel);
