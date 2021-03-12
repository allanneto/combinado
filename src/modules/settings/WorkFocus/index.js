/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {View, PermissionsAndroid, StatusBar, Platform} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import {Icon} from 'react-native-elements';

import * as Styled from './styles';

// Para uso de notificações
import OneSignal from 'react-native-onesignal';
import {onSignalKey, oneTag} from '~/services/notificaApi';
import {updateUser} from '~/services/authApi';
import Colors from '~/config/Colors';
import {Creators as focusActions} from '~/redux/ducks/focus';
import {Creators as authActions} from '~/redux/ducks/auth';
import {Creators as regActions} from '~/redux/ducks/reg';
import {getLocal} from '~/services/coordApi';

class WorkFocus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: this.props.authState,
      modalShowing: false,
      loading: false,
      error: null,
      message: null,
      code: '',
      user: null,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: '',
      headerStyle: {
        backgroundColor: '#201E5E',
        elevation: 0,
        shadowColor: 'transparent',
      },
      headerTintColor: Colors.white,
      headerRight: () => (
        <View style={{marginRight: 8}}>
          <Icon
            name="menu"
            color={Colors.white}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>
      ),
    };
  };

  componentDidMount() {
    !this.props.auth.user.pic && this.props.navigation.navigate('UserPicture');

    OneSignal.init(onSignalKey, {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('ids', this.onIdsPush);
    OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.configure()
    if (__DEV__) {
      console.tron.log('OneSignal add Listener (main)');
    }
    this.startLocation();
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIdsPush);
    OneSignal.removeEventListener('opened', this.onOpened);
    if (__DEV__) {
      console.tron.log('OneSignal remove Listener (main)');
    }
  }

  startLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    if (!this.props.reg || !this.props.reg.reg) {
      this.getLocation();
    }
  };

  getLocation = () => {
    let local;
    Geolocation.getCurrentPosition(
      async pos => {
        local = await getLocal(pos.coords.latitude, pos.coords.longitude);
        const where = `${local.country}#${local.region}#${local.city}`;
        this.props.regActions.setReg(where);
        oneTag(this.props.auth.user.ema, where);
        this.locWhere = `${local.city}/${local.region}`;
        if (__DEV__) {
          console.tron.log('LOCAL', local);
        }
      },
      err => (__DEV__ ? console.tron.log('ERRO', err) : console.log(err)),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  };

  onOpened = async openResult => {
    if (__DEV__) {
      console.tron.log('OneSignal open (main)', openResult);
    }
  };

  onIdsPush = async device => {
    // Receive Id do usuário {pushToken: "xxxx", "userId":""}
    if (__DEV__) {
      console.tron.log('OneSignal Ids (main)', device);
    }
    if (device.pushToken) {
      this.setState({code: device.userId});
      // Save token for current user
      const ntk = device.userId;
      try {
        await updateUser({ntk: ntk});
        this.props.authActions.udateCurrentUser({ntk: ntk});
        oneTag(this.props.auth.user.ema);
        OneSignal.promptLocation();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  choice = async option => {
    this.props.focusActions.setFocus(option);
  };

  disconnect = async () => {
    this.props.authActions.signOut();
  };

  formatLocal = () => {
    if (this.props.reg && this.props.reg.reg) {
      const p = this.props.reg.reg.split('#');
      return `${p[2]}/${p[1]}`;
    }
    return '';
  };

  render() {
    return (
      <Styled.Container>
        <StatusBar backgroundColor="#201E5E" />
        <Styled.Gradient colors={['#201E5E', '#312884', '#5322A7']}>
          <Styled.HeaderText>Localização</Styled.HeaderText>
          <Styled.LocalizationButton
            onPress={() => this.props.navigation.navigate('WorkAddr')}>
            <Styled.LocalizationText>
              {this.formatLocal()}
            </Styled.LocalizationText>
          </Styled.LocalizationButton>
          <Styled.Content>
            <Styled.Item
              onPress={() => this.props.navigation.navigate('TabNavigator2')}>
              <Styled.ItemTextA>
                <Styled.Text>QUERO</Styled.Text>
                <Styled.Text>CONTRATAR</Styled.Text>
              </Styled.ItemTextA>
              <Styled.ImageItem
                source={require('~/assets/images/quero_contratar.png')}
              />
            </Styled.Item>
            <Styled.Item
              onPress={() => this.props.navigation.navigate('TabNavigator1')}>
              <Styled.ImageItemB
                source={require('~/assets/images/quero_trabalhar.png')}
              />
              <Styled.ItemTextB>
                <Styled.Text>QUERO</Styled.Text>
                <Styled.Text>TRABALHAR</Styled.Text>
              </Styled.ItemTextB>
            </Styled.Item>
          </Styled.Content>
        </Styled.Gradient>
      </Styled.Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    regActions: bindActionCreators(regActions, dispatch),
    focusActions: bindActionCreators(focusActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WorkFocus);
