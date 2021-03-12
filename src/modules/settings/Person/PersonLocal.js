import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {connect} from 'react-redux';
import {Button} from 'react-native-paper';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Colors from '~/config/Colors';
import PlaceInput from '~/components/PlaceInput';
import {updateUser} from '~/services/authApi';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {oneTag} from '~/services/notificaApi';

class PersonLocal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Endereço',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const user = this.props.auth.user;
    if (!user.geo || !user.geo.lat || !user.geo.lng) {
      this.getLocation();
    }
    this.setState({
      user,
      loc: '',
      lat: user.geo ? user.geo.lat : null,
      lng: user.geo ? user.geo.lng : null,
      reg: '',
      geo: {},
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
    this.setState({reg, geo, loc: text, lat: geo.lat, lng: geo.lng, ok: true});
  };

  saveValue = async () => {
    if (!this.state.loc || !this.state.lat || !this.state.lng) {
      this.setState({error: 'Endereço inválido ou incompleto'});
      return;
    }
    this.setState({loading: true});
    const user = {
      userId: this.state.user.userId,
      loc: this.state.loc,
      reg: this.state.reg,
      geo: this.state.geo,
    };
    try {
      await updateUser(user);
      this.props.udateCurrentUser({
        loc: this.state.loc,
        reg: this.state.reg,
        geo: this.state.geo,
      });
      oneTag(user.userId);
      this.setState({loading: false, error: null});
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: err.message});
    }

    updateUser(user)
      .then(() => {
        this.setState({loading: false, error: null});
        this.props.udateCurrentUser({loc: this.state.loc});
        this.props.navigation.goBack();
      })
      .catch(() => {
        this.setState({loading: false, error: 'Erro de gravação'});
      });
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
                  Salvar
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
  headerContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(authActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonLocal);
