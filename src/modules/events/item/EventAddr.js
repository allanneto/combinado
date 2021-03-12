import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {connect} from 'react-redux';
import {Button} from 'react-native-paper';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Colors from '~/config/Colors';
import PlaceInput from '~/components/PlaceInput';

class EventAddr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Local do evento',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {event, onChange, ro} = this.props.navigation.state.params;
    if (!event.geo || !event.geo.lat || !event.geo.lng) {
      this.getLocation();
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      event,
      loc: '',
      lat: event.geo ? event.geo.lat : null,
      lng: event.geo ? event.geo.lng : null,
      reg: '',
      geo: {},
      onChange,
      ro,
      loaded: true,
      error: null,
      ok: false,
    });
  }

  getLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        this.setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      err => (__DEV__ ? console.tron.log('ERRO', err) : console.log(err)),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  };

  setValue = (text, place) => {
    const reg = `${place.country}#${place.region}#${place.city}`;
    const geo = place.geo;
    this.setState({
      reg,
      geo,
      loc: text,
      lat: geo.lat,
      lng: geo.lng,
      ok: true,
    });
  };

  saveValue = () => {
    if (!this.state.loc || !this.state.lat || !this.state.lng) {
      this.setState({error: 'Endereço inválido ou incompleto'});
      return;
    }
    this.state.onChange('loc', this.state.loc);
    this.state.onChange('geo', this.state.geo);
    this.state.onChange('reg', this.state.reg);
    this.props.navigation.goBack();

    // this.setState({ loading: true })
    // const event = {
    //   userId: this.state.event.userId,
    //   eventId: this.state.event.eventId,
    //   loc: this.state.loc,
    //   reg: this.state.reg,
    //   geo: this.state.geo
    // }
    // updateEvent(event)
    //   .then(() => {
    //     this.setState({ loading: false, error: null })
    //     this.state.onChange('loc', this.state.loc)
    //     this.state.onChange('geo', this.state.geo)
    //     this.props.navigation.state.params.onNavigateBack()
    //     this.props.navigation.goBack()
    //   })
    //   .catch(() => {
    //     this.setState({ loading: false, error: 'Erro de gravação' })
    //   })
  };

  render() {
    const {ro, loc, lat, lng} = this.state;
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            {this.state.lat && this.state.lng ? (
              <View style={styles.mapContainer}>
                <PlaceInput
                  local={this.state.loc}
                  lat={this.state.lat}
                  lng={this.state.lng}
                  set={this.setValue}
                  ro={ro}
                />
                <MapView
                  // showsUserLocation
                  zoomControlEnabled
                  style={styles.mapContainer}
                  region={{
                    latitude: this.state.lat,
                    longitude: this.state.lng,
                    latitudeDelta: 0.0015,
                    longitudeDelta: 0.00121,
                  }}>
                  <MapView.Marker
                    coordinate={{
                      latitude: this.state.lat,
                      longitude: this.state.lng,
                    }}
                  />
                </MapView>
              </View>
            ) : null}

            {this.state.ok && !ro && loc && lat && lng ? (
              <View style={styles.cmdContainer}>
                <Button
                  mode="contained"
                  icon="check"
                  loading={this.state.loading}
                  onPress={() => this.saveValue()}>
                  Confirmar
                </Button>
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
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
  contentContainer: {
    height: 64,
    backgroundColor: Colors.white,
  },
  mapContainer: {
    flex: 1,
  },
  fieldsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cmdContainer: {
    padding: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.lightColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(EventAddr);
