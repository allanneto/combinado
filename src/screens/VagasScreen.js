/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import {FAB} from 'react-native-paper';
import {Icon} from 'react-native-elements';

import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';

import Colors from '~/config/Colors';
import {listJobs} from '~/services/jobsApi';
import JobCard from '~/components/JobCard';
import {
  NavigationEvents,
  // StackActions,
  NavigationActions,
} from 'react-navigation';
import {bindActionCreators} from 'redux';
import {Creators as regActions} from '~/redux/ducks/reg';
import {getLocal} from '~/services/coordApi';
import {encodeParam} from '~/services/utils';

// Para uso de notificações
import OneSignal from 'react-native-onesignal';
import {
  onSignalKey,
  oneTag,
  notificationSentList,
} from '~/services/notificaApi';
import {updateUser} from '~/services/authApi';

class VagasScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Vagas',
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
            onPress={() => navigation.dispatch(NavigationActions.back())}
            // onPress={() => navigation.dispatch(StackActions.popToTop())}
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
    // OneSignal.configure()
    if (__DEV__) {
      console.tron.log('OneSignal add Listener (vagas)');
    }
    this.startLocation();
    this.makeRemoteRequest();
    // this.setState({ user: this.props.auth.user }, () => {
    //   this.makeRemoteRequest()
    // })
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIdsPush);
    OneSignal.removeEventListener('opened', this.onOpened);
    if (__DEV__) {
      console.tron.log('OneSignal remove Listener (vagas)');
    }
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
                this.props.auth.user &&
                  oneTag(this.props.auth.user.ema, this.props.reg.reg);
              },
            },
            {
              text: `Mudar para ${local.city}/${local.region}`,
              onPress: () => {
                this.props.regActions.setReg(where);
                this.props.auth.user && oneTag(this.props.auth.user.ema, where);
                this.locWhere = `${local.city}/${local.region}`;
                this.makeRemoteRequest();
                this.handleRefresh();
              },
            },
          ]);
        } else {
          this.props.regActions.setReg(where);
          this.props.auth.user && oneTag(this.props.auth.user.ema, where);
          this.locWhere = `${local.city}/${local.region}`;
          if (__DEV__) {
            console.tron.log('LOCAL', local);
          }
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
      console.tron.log('OneSignal open (vagas)', openResult);
    }
    if (openResult.notification.payload.title === 'Novas vagas!') {
      this.props.navigation.navigate('Vagas');
    } else if (
      openResult.notification.payload.title.substring(0, 6) === 'Sobre:'
    ) {
      this.props.navigation.navigate('Message');
    } else if (openResult.notification.payload.title === 'Nova postagem') {
      this.props.navigation.navigate('Work');
    } else {
      this.props.navigation.navigate('Notification');
    }
  };

  onIdsPush = async device => {
    // Receive Id do usuário {pushToken: "xxxx", "userId":""}
    if (__DEV__) {
      console.tron.log('OneSignal Ids (vagas)', device);
    }
    if (device.pushToken) {
      this.setState({code: device.userId});
      // Save token for current user
      const ntk = device.userId;
      try {
        await updateUser({ntk: ntk});
        this.props.authActions.udateCurrentUser({ntk: ntk});
        this.props.auth.user && oneTag(this.props.auth.user.ema);
        OneSignal.promptLocation();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  makeRemoteRequest = () => {
    const filter = this.props.search.job;
    const reg = this.props.reg ? this.props.reg.reg : '';
    const queryParams = {reg};
    if (filter) {
      queryParams.job = filter;
    }
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      if (!this.props.auth.user) {
        listJobs(query).then(res => {
          this.setState({
            data: !start ? res.Items : [...this.state.data, ...res.Items],
            last: res.LastEvaluatedKey,
            error: res.error || null,
            sent: [],
            loading: false,
            refreshing: false,
          }).catch(error => {
            this.setState({error, loading: false});
          });
        });
      } else {
        // const ntfs = [];
        notificationSentList(this.props.auth.user.ema)
          .then(ntfs => {
            listJobs(query).then(res => {
              this.setState({
                data: !start ? res.Items : [...this.state.data, ...res.Items],
                last: res.LastEvaluatedKey,
                error: res.error || null,
                sent: ntfs || [],
                loading: false,
                refreshing: false,
              });
            });
          })
          .catch(error => {
            this.setState({error, loading: false});
          });
      }
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

  viewJob = job => {
    if (this.props.auth.user) {
      this.props.navigation.navigate('EventOrgData', {
        ema: job.ema,
        dat: job.dat,
        tsk: job.tsk,
        val: job.val,
        pic: job.pic,
        ro: true,
        isJob: true,
        sld: job.qtd - (job.qpr || 0),
        // onNavigateBack: this.handleRefresh,
      });
    } else {
      Alert.alert('Conecte-se para acessar');
    }
  };

  handleSearch = () => {
    this.props.navigation.navigate('JobSearch', {
      onNavigateBack: this.handleRefresh,
    });
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
        <View style={styles.header}>
          <Text style={styles.sectionText}>
            {this.props.search.job
              ? `Vagas de ${this.props.search.job}`
              : 'Todas as vagas'}
          </Text>
        </View>
        {this.state.data && this.state.data.length > 0 ? (
          <FlatList
            removeClippedSubviews
            data={this.state.data}
            renderItem={({item}) => (
              <JobCard
                item={item}
                org={this.state.sent.filter(r => r.skill === item.jobId)}
                onPress={() => this.viewJob(item)}
              />
            )}
            keyExtractor={(item, i) => `${item.eventId}.${item.jobId}${i}`}
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
            <Text style={{color: Colors.tabIconDefault, fontSize: 14}}>
              Modifique a consulta ou tente mais tarde
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{color: Colors.tabIconDefault, fontSize: 16}}>
              Procurando...
            </Text>
          </View>
        )}
        {this.props.auth.user && (
          <FAB style={styles.fab} icon="magnify" onPress={this.handleSearch} />
        )}
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
  header: {
    padding: 8,
    backgroundColor: Colors.tabBar,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.tabIconSelected,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 24,
    bottom: 24,
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
  checkStyle: {
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  btnFilterStyle: {
    backgroundColor: 'transparent',
    // color: Colors.mainColor
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    backgroundColor: 'transparent',
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
)(VagasScreen);
