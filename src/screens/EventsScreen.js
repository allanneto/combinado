/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import {FAB} from 'react-native-paper';
import {NavigationEvents, StackActions} from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';

import Colors from '~/config/Colors';
import OrgCard from '~/components/OrgCard';
import {bindActionCreators} from 'redux';
import {Creators as regActions} from '~/redux/ducks/reg';
import {getLocal} from '~/services/coordApi';
import {encodeParam} from '~/services/utils';
import {listEvents} from '~/services/eventsApi';
// Para uso de notificações
import OneSignal from 'react-native-onesignal';
import {onSignalKey, oneTag} from '~/services/notificaApi';
import {updateUser} from '~/services/authApi';
import {statusProfileOrg} from '~/services/usersApi';

class EventsScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Eventos',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
      headerLeft: () => (
        <View style={{marginLeft: 8}}>
          <Icon
            name="chevron-left"
            color={Colors.white}
            onPress={() => navigation.dispatch(StackActions.popToTop())}
          />
        </View>
      ),
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

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: '',
      error: null,
      refreshing: false,
      selectedIndex: 0,
      myCast: false,
      mbCast: false,
      user: null,
      open: false,
    };
  }

  componentDidMount() {
    OneSignal.init(onSignalKey, {
      kOSSettingsKeyAutoPrompt: true,
    });
    OneSignal.addEventListener('ids', this.onIdsPush);
    OneSignal.addEventListener('opened', this.onOpened);
    this.startLocation();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user}, () => {
      this.makeRemoteRequest();
    });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIdsPush);
    OneSignal.removeEventListener('opened', this.onOpened);
  }

  startLocation = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
    this.getLocation();
  };

  getLocation = () => {
    let local;
    Geolocation.getCurrentPosition(
      async pos => {
        local = await getLocal(pos.coords.latitude, pos.coords.longitude);
        const where = `${local.country}#${local.region}#${local.city}`;
        if (
          this.props.reg &&
          this.props.reg.reg &&
          this.props.reg.reg !== where
        ) {
          const arr = this.props.reg.reg.split('#');
          const msg = `Estava em ${arr[2]}/${arr[1]}\nParece estar agora em ${
            local.city
          }/${local.region}`;
          Alert.alert('Sua localização mudou', msg, [
            {
              text: `Permanecer em ${arr[2]}/${arr[1]}`,
              onPress: () => {
                oneTag(this.props.auth.user.ema, this.props.reg.reg);
              },
            },
            {
              text: `Mudar para ${local.city}/${local.region}`,
              onPress: () => {
                this.props.regActions.setReg(where);
                oneTag(this.props.auth.user.ema, where);
                this.locWhere = `${local.city}/${local.region}`;
                this.makeRemoteRequest();
                this.handleRefresh();
              },
            },
          ]);
        } else {
          this.props.regActions.setReg(where);
          oneTag(this.props.auth.user.ema, where);
          this.locWhere = `${local.city}/${local.region}`;
          // if (__DEV__) {
          //   console.tron.log('LOCAL', local);
          // }
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
      console.tron.log('OneSignal open (events)', openResult);
    }
    this.props.navigation.navigate('Vision');
    // if (openResult.notification.payload.title === 'Nova postagem') {
    //   this.props.navigation.navigate('Message');
    // } else {
    //   this.props.navigation.navigate('Notification');
    // }
  };

  onIdsPush = async device => {
    // Receive Id do usuário {pushToken: "xxxx", "userId":""}
    // if (__DEV__) {
    //   console.tron.log('OneSignal Ids (events)', device);
    // }
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

  makeRemoteRequest = () => {
    const queryParams = {};
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      listEvents(query)
        .then(res => {
          this.setState({
            data: !start ? res.Items : [...this.state.data, ...res.Items],
            last: res.LastEvaluatedKey,
            error: res.error || null,
            loading: false,
            refreshing: false,
          });
        })
        .catch(error => {
          this.setState({error, loading: false});
        });
    }
  };

  handleRefresh = () => {
    this.setState(
      {
        last: null,
        start: null,
        loading: true,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  handleLoadMore = () => {
    if (this.state.last) {
      this.setState(
        {
          start: this.state.last,
          loading: true,
        },
        () => {
          this.makeRemoteRequest();
        },
      );
    }
  };

  viewEvent = evnt => {
    this.props.navigation.navigate('EventEdit', {
      email: evnt.ema,
      dat: evnt.dat,
      insert: false,
      onNavigateBack: this.handleRefresh,
    });
  };

  // searchEvent = () => {
  //   this.props.navigation.navigate("FilterEventOrg", {
  //     onNavigateBack: () => this.updateIndex(this.state.selectedIndex)
  //   });
  // }

  newEvent = () => {
    if (!statusProfileOrg(this.props.auth.user)) {
      Alert.alert(
        'Aviso',
        'Seu perfil está incompleto.\n' +
          'Precisa ter foto, endereço, cep, cpf ou cnpj e dados do cartão de crédito.\n\n' +
          'Acesse o Menu "Meu perfil" e complete seu cadastro.',
      );
      return;
    }
    this.props.navigation.navigate('EventEdit', {
      insert: true,
      onNavigateBack: this.handleRefresh,
    });
    // const userId = this.state.user.sub
    // const eventId = uuidv4()
    // const newEvent = {
    //   userId: userId,
    //   eventId: eventId,
    //   dat: moment().format('YYYY-MM-DD'),
    //   nom: this.state.user.nom,
    //   ema: this.state.user.ema,
    //   pic: this.state.user.pic,
    //   cel: this.state.user.cel,
    //   ini: moment()
    //     .add(24, 'hours')
    //     .format(),
    //   sta: 0
    // }
    // insertEvent(newEvent)
    //   .then(() => {
    //     this.viewEvent(newEvent)
    //   })
    //   .catch(err => {
    //     Alert.alert('Erro', err.message)
    //   })
  };

  updateIndex = selectedIndex => {
    this.setState({selectedIndex, loading: true, page: ''}, () => {
      this.makeRemoteRequest();
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleRefresh} />
        {this.state.data && this.state.data.length > 0 ? (
          <FlatList
            removeClippedSubviews
            data={this.state.data}
            renderItem={({item}) => (
              <OrgCard item={item} onPress={() => this.viewEvent(item)} />
            )}
            keyExtractor={(item, i) => item.dat}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
          />
        ) : !this.state.loading ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="cloud-question"
              type="material-community"
              color={Colors.tabIconDefault}
              size={36}
              iconStyle={{marginBottom: 4}}
            />
            <Text style={{color: Colors.tabIconSelected, fontSize: 16}}>
              Nenhum registro encontrado
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{color: Colors.tabIconDefault, fontSize: 16}}>
              Procurando...
            </Text>
          </View>
        )}

        <FAB style={styles.fab} icon="plus" onPress={() => this.newEvent()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  headerContainer: {
    backgroundColor: Colors.mainColor,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    borderTopColor: Colors.mainColor,
    borderTopWidth: 0,
  },
  subContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 20,
    bottom: 20,
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventsScreen);
