/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert, Text} from 'react-native';
import {updateEvent} from '~/services/eventsApi';
import {TextInput, Button} from 'react-native-paper';

import Colors from '~/config/Colors';

class EventDes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Descrição de evento',
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
      item: event.des || null,
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
    Keyboard.dismiss();
    this.setState({loading: true});
    const event = {
      userId: this.state.event.userId,
      eventId: this.state.event.eventId,
      des: this.state.item,
    };
    updateEvent(event)
      .then(() => {
        this.setState({loading: false, error: null});
        this.state.onChange('des', this.state.item);
        this.props.navigation.state.params.onNavigateBack();
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: 'Erro de gravação ' + err.message,
        });
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
            <Text>Descrição do evento</Text>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              label="Descrição"
              value={this.state.item}
              multiline
              style={{marginBottom: 8, backgroundColor: 'white'}}
              editable={!this.state.ro}
              onChangeText={text =>
                !this.state.ro ? this.changeValue(text) : null
              }
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

export default connect(mapStateToProps)(EventDes);
