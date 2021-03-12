/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
// import {NavigationEvents} from 'react-navigation';
import QRCode from 'react-native-qrcode-generator';

import {Button} from 'react-native-paper';
import {Text, Icon} from 'react-native-elements';
import {getImageUrl} from '~/services/s3Api';
import isAfter from 'date-fns/isAfter';

import Colors from '../../config/Colors';
import {isEventBlocked, canActivate, qrMailEvent} from '~/services/eventsApi';

const numbro = require('numbro');
let ptbr = require('numbro/dist/languages/pt-BR.min');
numbro.registerLanguage(ptbr, true);
numbro.setLanguage('pt-BR');

class TaskItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      user: null,
    };
  }

  componentDidMount() {
    getImageUrl(this.props.pic).then(image => {
      this.setState({
        loaded: true,
        image,
      });
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    const qpr = this.props.qpr;
    const cod = this.props.cod;
    const qtd = this.props.qtd;
    const val = this.props.val;
    const pic = this.state.image;
    const det = this.props.det;
    return (
      <TouchableWithoutFeedback onPress={() => det(qpr, cod, qtd, val, pic)}>
        <View style={styles.card}>
          {pic ? (
            <Image
              source={{
                uri: pic,
              }}
              style={styles.icon}
              resizeMode="contain"
            />
          ) : (
            <Image style={styles.icon} resizeMode="contain" />
          )}
          <Text style={[styles.line, {width: '40%'}]}>{cod}</Text>
          <Text style={[styles.line, {width: '10%'}]}>
            {/* {qpr}/{qtd} */}
            {qtd}
          </Text>
          <Text style={[styles.line, {width: '20%'}]}>
            {parseFloat(val)
              .toFixed(2)
              .toLocaleString()}
          </Text>
          {det ? (
            <Icon
              name="chevron-right"
              type="material-icons"
              color={Colors.lightColor}
              iconStyle={{margin: 8}}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class EventOrgTasks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      event: null,
      error: null,
      tsk: [],
    };
  }

  componentDidMount() {
    const {
      event,
      onChange,
      ro,
      onNavigateBack,
      setActivate,
      dirty,
    } = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      event,
      ro,
      onChange,
      onNavigateBack,
      setActivate,
      dirty,
      loaded: true,
    });
  }

  static navigationOptions = {
    title: 'Vagas',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  viewUser = item => {
    this.props.navigation.navigate('TeamData', {
      team: item,
      casting: this.state.casting,
      onNavigateBack: this.onRefresh,
      ro: this.state.ro,
    });
  };

  totJobs = () => {
    const tsk = this.state.event.tsk || [];
    return tsk.length;
  };

  totVagas = () => {
    const tsk = this.state.event.tsk || [];
    const tot = tsk.reduce((p, r) => p + r.qtd, 0);
    return parseInt(tot, 10).toLocaleString();
  };

  totValor = () => {
    const tsk = this.state.event.tsk || [];
    const tot = tsk.reduce((p, r) => p + r.val * r.qtd, 0);
    return numbro(parseFloat(tot)).format({
      thousandSeparated: true,
      mantissa: 2,
    });
  };

  fmtDecimal = num => {
    return parseFloat(num)
      .toFixed(2)
      .toLocaleString();
  };

  setValue = tsk => {
    this.setState({event: {...this.state.event, tsk}});
  };

  newTask = () => {
    this.props.navigation.navigate('EventTaskItem', {
      event: this.state.event,
      onChange: this.state.onChange,
      onValue: this.setValue,
      setActivate: this.state.setActivate,
      ro: this.state.ro,
      onNavigateBack: this.props.navigation.state.params.onNavigateBack,
    });
  };

  activateTask = () => {
    this.state.setActivate();
    this.props.navigation.goBack(this.props.navigation.state.key);
  };

  detTask = (qpr, cod, qtd, val, pic) => {
    this.props.navigation.navigate('EventTeam', {
      event: this.state.event,
      onChange: this.state.onChange,
      setValue: this.setValue,
      setActivate: this.state.setActivate,
      skill: cod,
      qtd: qtd,
      qpr: qpr,
      val: val,
      pic: pic,
      onNavigateBack: this.props.navigation.state.params.onNavigateBack,
    });
  };

  mailCode = async () => {
    const data = {
      img: this.state.img,
      event: this.state.event,
    };
    const ret = await qrMailEvent(data);
    Alert.alert(ret);
  };

  eventCanClose = () => {
    const today = new Date();
    const ini = new Date(this.state.event.ini);
    return !isAfter(ini, today) && this.state.event.sta === 1;
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          {/* <NavigationEvents onDidFocus={() => this.handleRefresh()} /> */}
          <View style={styles.sub}>
            <View style={styles.header}>
              <View styte={styles.headItem}>
                <View style={styles.subHead}>
                  <Text style={styles.headText}>Serviços</Text>
                </View>
                <View style={styles.subHead}>
                  <Text style={styles.headNumber}>{this.totJobs()}</Text>
                </View>
              </View>

              <View styte={styles.headItem}>
                <View style={styles.subHead}>
                  <Text style={styles.headText}>Vagas</Text>
                </View>
                <View style={styles.subHead}>
                  <Text style={styles.headNumber}>{this.totVagas()}</Text>
                </View>
              </View>

              <View styte={styles.headItem}>
                <View style={styles.subHead}>
                  <Text style={styles.headText}>Valor</Text>
                </View>
                <View style={styles.subHead}>
                  <Text style={styles.headNumber}>{this.totValor()}</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView>
            {this.state.event.tsk &&
              this.state.event.tsk.map(reg => (
                <TaskItem
                  cod={reg.key}
                  qtd={reg.qtd}
                  val={reg.val}
                  qpr={reg.qpr}
                  pic={reg.pic}
                  key={reg.key}
                  det={this.detTask}
                />
              ))}
            {this.eventCanClose() && (
              <View style={styles.qrCode}>
                <View style={styles.qrText}>
                  <Text>QRCode para confirmação de presença</Text>
                </View>
                <View style={styles.qrIcon}>
                  <QRCode
                    value={`${this.state.event.ema}#${this.state.event.dat}`}
                    size={200}
                    bgColor="black"
                    fgColor="white"
                    getImageOnLoad={img => this.setState({img: img})}
                  />
                </View>
                <View style={styles.qrMail}>
                  {/* <Text>{this.state.img}</Text> */}
                  <Button
                    uppercase={false}
                    icon="email"
                    mode="contained"
                    color={Colors.secColor}
                    disabled={this.state.working}
                    onPress={this.mailCode}>
                    Enviar por e-Mail
                  </Button>
                </View>
              </View>
            )}
          </ScrollView>
          {!isEventBlocked(this.state.event) && (
            <View style={styles.cmdBar}>
              {!this.state.dirty && canActivate(this.state.event) && (
                <Button
                  compact
                  uppercase={false}
                  icon="check"
                  mode="contained"
                  color={Colors.secColor}
                  disabled={this.state.working}
                  onPress={this.activateTask}>
                  Publicar
                </Button>
              )}
              <Button
                compact
                uppercase={false}
                icon="check"
                mode="contained"
                color={Colors.mainColor}
                disabled={this.state.working}
                onPress={this.newTask}>
                Adicionar
              </Button>

              {/* <FAB style={styles.fab} icon='add' onPress={() => this.newTask()} /> */}
            </View>
          )}
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
  },
  sub: {
    height: 80,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  qrCode: {
    flexDirection: 'column',
    paddingBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Colors.lightFG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    backgroundColor: Colors.white,
    margin: 16,
  },
  qrMail: {
    marginTop: 20,
  },
  qrText: {
    marginBottom: 10,
  },
  qrText2: {
    fontWeight: 'bold',
  },
  subHead: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headItem: {
    // flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  headText: {
    fontSize: 16,
    color: Colors.lightColor,
  },
  headNumber: {
    fontSize: 30,
    color: Colors.mainColor,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 24,
    bottom: 24,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    padding: 6,
    borderColor: 'silver',
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
  },
  line: {
    fontSize: 14,
    width: '22%',
    color: Colors.mainColor,
  },
  contentContainer: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  actContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cmdContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    height: 40,
    width: '10%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(EventOrgTasks);
