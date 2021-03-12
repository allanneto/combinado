import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {bindActionCreators} from 'redux';
import Geolocation from 'react-native-geolocation-service';

import {connect} from 'react-redux';
import {Button} from 'react-native-paper';
import MapView from 'react-native-maps';
import {Creators as regActions} from '~/redux/ducks/reg';
import {Creators as searchActions} from '~/redux/ducks/search';

import Colors from '~/config/Colors';
import PlaceInput from '~/components/PlaceInput';
import {getLocal} from '~/services/coordApi';

class WorkAddr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Local de trabalho',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    this.getLocation();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      loc: '',
      lat: null,
      lng: null,
      reg: '',
      geo: {},
      loaded: true,
      error: null,
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
    this.setState({reg, geo, loc: text, lat: geo.lat, lng: geo.lng});
  };

  saveValue = () => {
    if (!this.state.loc || !this.state.lat || !this.state.lng) {
      this.setState({error: 'Local inválido ou incompleto'});
      return;
    }
    this.props.regActions.setReg(this.state.reg);
    this.props.searchActions.resetUserSearch();
    this.props.navigation.goBack();
  };

  clearValue = async () => {
    const local = await getLocal(this.state.lat, this.state.lng);
    this.props.regActions.setReg(
      `${local.country}#${local.region}#${local.city}`,
    );
    this.props.searchActions.resetUserSearch();
    this.props.navigation.goBack();
  };

  render() {
    const {loc, lat, lng} = this.state;
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <View style={styles.mapContainer}>
              <PlaceInput
                local={this.state.loc}
                lat={this.state.lat}
                lng={this.state.lng}
                set={this.setValue}
                ro={false}
              />
              {this.state.lat && this.state.lng ? (
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
              ) : null}
            </View>

            {loc && lat && lng ? (
              <View style={styles.cmdContainer}>
                <Button
                  mode="contained"
                  icon="map-marker-check"
                  uppercase={false}
                  loading={this.state.loading}
                  onPress={() => this.saveValue()}>
                  Usar este local
                </Button>
              </View>
            ) : (
              <View style={styles.cmdContainer}>
                <Button
                  mode="contained"
                  icon="map-marker-check"
                  uppercase={false}
                  loading={this.state.loading}
                  onPress={() => this.clearValue()}>
                  Usar minha localização
                </Button>
              </View>
            )}
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
    paddingTop: 8,
    paddingBottom: 16,
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

const mapDispatchToProps = dispatch => {
  return {
    regActions: bindActionCreators(regActions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkAddr);
