/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Image,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {formatDateISO} from '~/locales/format';
import isAfter from 'date-fns/isAfter';

import {getImageUrl} from '~/services/s3Api';
import {createNotification, notificationSent} from '~/services/notificaApi';
import {readUser} from '~/services/usersApi';
import {truncateWords} from '~/services/utils';
import Colors from '~/config/Colors';

import {getEvent, isEventBlocked, getSkillName} from '~/services/eventsApi';
import {statusProfile} from '~/services/usersApi';
import {encodeParam} from '~/services/utils';

import {deleteWork, workEvent, workAloc} from '~/services/worksApi';
import parseISO from 'date-fns/parseISO';

class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    getImageUrl(this.props.item.pic).then(image => {
      this.setState({loaded: true, image});
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <ListItem
        title="Organizador"
        subtitle={this.props.item.nom}
        bottomDivider
        // chevron
        subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
        leftAvatar={{
          rounded: true,
          source: this.state.image && {uri: this.state.image},
        }}
        // onPress={this.props.onPress}
      />
    );
  }
}

class EventOrgData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      working: false,
      insert: false,
      event: null,
      user: null,
      ro: false,
      open: false,
      hasMapPermission: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Evento',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
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
    const {
      ema,
      dat,
      tsk,
      pic,
      work,
      val,
      sld,
      ro,
      vpre,
      wreg,
      isJob,
    } = this.props.navigation.state.params;
    this.requestFineLocation();
    getEvent(ema, dat).then(res => {
      const reg = res;
      const agora = new Date();
      const ini = new Date(reg.ini);
      const fim = new Date(reg.fim);
      const dia = parseISO(reg.ini.substr(0, 8) + '01');
      this.setState({
        event: reg,
        tsk,
        work,
        sld,
        val,
        pic,
        isJob,
        wreg,
        dia,
        vpre: vpre || false,
        dhr: wreg,
        aftr: isAfter(agora, ini),
        past: isAfter(agora, fim),
        present: isAfter(agora, ini) && isAfter(fim, agora),
        future: isAfter(ini, agora),
        loaded: true,
        user: this.props.auth.user,
        ro: ro || false,
      });
    });
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({hasMapPermission: true});
        }
      } else {
        this.setState({hasMapPermission: true});
      }
    } catch (err) {
      __DEV__ ? console.tron.log(err) : console.log(err);
    }
  }

  getTasks = () => {
    if (this.state.event.tsk) {
      const pos = this.state.event.tsk.length;
      const tot = this.state.event.tsk.reduce((p, r) => p + r.qtd, 0);
      return `${tot} vagas para ${pos} serviços`;
    }
    return 'Nenhuma vaga criada ainda';
  };

  handleAskEvent = async () => {
    const sk = this.state.tsk;
    const skl = this.props.auth.user.skl;
    this.setState({working: true});

    // Tem saldo de valgas
    if (!this.state.sld) {
      Alert.alert(
        'Aviso',
        `Vagas para ${
          this.state.tsk
        } já preenchidas. Tente para outra especialidade`,
      );
      this.setState({working: false});
      return;
    }
    // Tenho a especialidade
    if (!skl || !skl.find(s => s === sk)) {
      Alert.alert(
        'Aviso',
        `Você não se cadastrou como ${this.state.tsk}.\n\n` +
          'Acesse Menu > Meus serviços e adicione suas especialidades.',
      );
      this.setState({working: false});
      return;
    }
    // Meu perfil está completo
    if (!statusProfile(this.props.auth.user)) {
      Alert.alert(
        'Aviso',
        'Seu perfil de usuário está incompleto.\n' +
          'Precisa ter foto, endereço, cep, cpf, conta bancária, data de aniversário e gênero.\n\n' +
          'Acesse o Menu "Meu perfil" e complete seu cadastro.',
      );
      this.setState({working: false});
      return;
    }

    // Não solicitei vaga no evento
    const notif = await notificationSent(
      this.state.user.ema,
      this.state.event.ema,
      this.state.event.dat,
    );
    if (notif.length > 0) {
      Alert.alert(
        'Aviso',
        `Você já solicitou vaga de ${
          notif[0].tsk
        } neste evento. Por favor aguarde resposta`,
      );
      this.setState({working: false});
      return;
    }

    // Ja esta inscrito
    const work = await workEvent(
      this.state.user.ema,
      this.state.event.dat,
      this.state.event.ema,
    );
    if (work && work.length > 0) {
      Alert.alert(
        'Aviso',
        `Você já está inscrito como ${work[0].tsk} neste evento.`,
      );
      this.setState({working: false});
      return;
    }

    // Não tem trabalho no mesmo periodo
    const query = encodeParam({
      ini: this.state.event.ini,
      fim: this.state.event.fim,
    });
    const works = await workAloc(query);
    if (works && works.length > 0) {
      Alert.alert(
        `Você já tem trabalho como ${
          works[0].tsk
        } no mesmo período. Por favor escolha outro dia ou hora`,
      );
      this.setState({working: false});
      return;
    }

    Alert.alert('Confirme a solicitação', 'Solicitação de vaga será enviada', [
      {
        text: 'Cancelar',
        style: 'cancel',
        onPress: async () => {
          this.setState({working: false});
        },
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.askForJob();
        },
      },
    ]);
  };

  askForJob = () => {
    this.setState({working: true});
    //(dst, tit, txt, user, event, tsk)
    createNotification(
      this.state.event.ema,
      'Solicitação de vaga',
      this.state.event.tit,
      this.state.user,
      this.state.event,
      this.state.tsk,
    )
      .then(() => {
        this.setState({working: false});
        this.props.navigation.goBack();
      })
      .catch(err => {
        this.setState({working: false});
        Alert.alert('Erro', err.message);
      });
  };

  handleAskLiberate = async () => {
    this.setState({working: true});
    Alert.alert(
      'Confirme a liberação',
      'A vaga será liberada e ficará disponível para outros',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: async () => {
            this.setState({working: false});
          },
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            this.liberateJob();
          },
        },
      ],
    );
  };

  liberateJob = async () => {
    this.setState({working: true});
    try {
      const user = await readUser(this.state.event.ema);
      const msgs = 'Vaga liberada pelo prestador';
      // Delete team register
      await deleteWork(
        this.state.user.ema,
        this.state.event.dat,
        this.state.event.ema,
        this.state.tsk,
      );
      // Notification to organizer
      createNotification(
        this.state.event.ema,
        msgs,
        this.state.event.tit,
        user,
        this.state.event,
        this.state.tsk,
        2,
      );
      this.setState({working: false});
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  getSkill = cod => {
    if (!cod) {
      return '';
    } else {
      return `- ${getSkillName(cod)}`;
    }
  };

  inscEvent = async () => {
    const notif = await notificationSent(
      this.state.user.ema,
      this.state.event.ema,
      this.state.event.dat,
    );
    __DEV__ && console.tron.log('NOTIFICATIONS SENT', notif);
    if (notif && notif.length > 0 && notif[0].tsk === this.state.tsk) {
      return true;
    }
    return false;
  };

  handleSendMessage = async () => {
    const canChat = this.state.future;
    const insc = await this.inscEvent();
    if (this.state.isJob && !insc) {
      Alert.alert(
        'Aviso',
        `Você não solicitou vaga nem está inscrito como ${
          this.state.tsk
        } neste evento.`,
      );
      return;
    }
    this.props.navigation.navigate('EventChat', {
      event: this.state.event,
      work: true,
      ro: !canChat,
      job: this.state.tsk, // job?
    });
  };

  handlePresence = async () => {
    this.props.navigation.navigate('EventQRCode', {
      work: this.state.wreg,
      updatePresence: this.updatePresence,
    });
  };

  updatePresence = async dhr => {
    this.setState({vpre: true, wreg: {...this.state.wreg, dhr: dhr}});
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.listStyle}>
              {this.state.isJob || this.state.work ? (
                <UserItem item={this.state.event} />
              ) : null}

              <ListItem
                title="Nome do evento"
                leftIcon={{
                  name: 'text-fields',
                  type: 'material',
                  color: Colors.lightColor,
                }}
                subtitle={this.state.event.tit}
                bottomDivider
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
              />
              <ListItem
                title="Descrição do evento"
                leftIcon={{
                  name: 'text',
                  type: 'entypo',
                  color: Colors.lightColor,
                }}
                subtitle={truncateWords(this.state.event.des || '', 10)}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() =>
                  this.props.navigation.navigate('EventDes', {
                    event: this.state.event,
                    onChange: this.setValue,
                    ro: true,
                  })
                }
              />
              {/* {!this.state.isJob || this.state.work ? (
                <ListItem
                  title="Celular para contato"
                  leftIcon={{
                    name: 'cellphone-android',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  subtitle={this.state.event.cel}
                  bottomDivider
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                />
              ) : null}
              {this.state.work ? (
                <ListItem
                  title="E-Mail"
                  leftIcon={{
                    name: 'email',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  subtitle={this.state.event.ema}
                  bottomDivider
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                />
              ) : null} */}

              <ListItem
                title="Local"
                leftIcon={{
                  name: 'location-on',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                subtitle={`${this.state.event.loc || ''} ${this.state.event
                  .cpl || ''}`}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() =>
                  this.props.navigation.navigate('EventAddr', {
                    event: this.state.event,
                    onChange: this.setValue,
                    ro: true,
                  })
                }
              />

              <ListItem
                title="Data/Hora inicial"
                leftIcon={{
                  name: 'md-calendar',
                  type: 'ionicon',
                  color: Colors.lightColor,
                }}
                bottomDivider
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                subtitle={
                  this.state.event.ini
                    ? formatDateISO(this.state.event.ini, 'P p')
                    : ''
                }
              />
              <ListItem
                title="Data/Hora final"
                bottomDivider
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                leftIcon={{
                  name: 'md-calendar',
                  type: 'ionicon',
                  color: Colors.lightColor,
                }}
                subtitle={
                  this.state.event.fim
                    ? formatDateISO(this.state.event.fim, 'P p')
                    : ''
                }
              />
              <ListItem
                title="Vaga"
                subtitle={`${this.state.tsk} - R$ ${parseFloat(
                  this.state.val,
                ).toFixed(2)}\n${
                  this.state.event.pgm === 'd'
                    ? 'Pagamento em dinheiro '
                    : 'Pagamento em conta'
                }`}
                bottomDivider
                subtitleStyle={{
                  color: Colors.mainColor,
                  fontWeight: 'bold',
                }}
                leftAvatar={
                  <Image
                    source={{uri: this.state.pic}}
                    style={{width: 36, height: 36}}
                  />
                }
                chevron={
                  this.state.event.pgm === 'd' ? (
                    <Icon
                      name="cash-multiple"
                      type="material-community"
                      color={Colors.mainColor}
                      size={15}
                    />
                  ) : (
                    <Icon
                      name="bank"
                      type="material-community"
                      color={Colors.mainColor}
                      size={15}
                    />
                  )
                }
              />
            </View>
            <View style={styles.confData}>
              <View style={styles.qrText}>
                {this.state.work && this.state.aftr && !this.state.vpre && (
                  <Button
                    uppercase={false}
                    icon="check"
                    mode="contained"
                    color={Colors.secColor}
                    onPress={this.handlePresence}>
                    Confirmar presença
                  </Button>
                )}
                {this.state.vpre && this.state.wreg.dhr && (
                  <View style={styles.message}>
                    <Text style={styles.qrText}>
                      Presença confirmada por QR code em{' '}
                      {formatDateISO(this.state.wreg.dhr, 'P p')}
                    </Text>
                  </View>
                )}
                {this.state.vpre &&
                  !this.state.wreg.aus &&
                  !this.state.wreg.dhr && (
                    <View style={styles.message}>
                      <Text style={styles.qrText}>
                        Presença confirmada pelo organizador
                      </Text>
                    </View>
                  )}
                {this.state.vpre && this.state.wreg.aus && (
                  <View style={styles.message}>
                    <Text style={styles.qrAus}>Marcado como usente</Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
          <View style={styles.cmdBar}>
            <Button
              compact
              uppercase={false}
              icon="comment-multiple-outline"
              mode="contained"
              color={Colors.secColor}
              disabled={this.state.working}
              onPress={this.handleSendMessage}>
              Chat
            </Button>

            {!this.state.past &&
            !this.state.work &&
            !isEventBlocked(this.state.event) ? (
              <Button
                compact
                uppercase={false}
                icon="star"
                mode="contained"
                disabled={this.state.working}
                onPress={this.handleAskEvent}>
                Solicitar a vaga
              </Button>
            ) : null}
            {!this.state.past && this.state.work ? (
              <Button
                compact
                uppercase={false}
                icon="star"
                mode="contained"
                color={Colors.errorBackground}
                disabled={this.state.working}
                onPress={this.handleAskLiberate}>
                Liberar a vaga
              </Button>
            ) : null}
          </View>
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
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  message: {
    padding: 8,
    backgroundColor: Colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.mainColor,
  },
  header: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  contentContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  helpText: {
    marginTop: 8,
    color: Colors.lightColor,
  },
  cmdContainer: {
    padding: 8,
  },
  buttonStyle: {
    backgroundColor: Colors.mainColor,
    borderColor: Colors.mainColor,
    borderWidth: 1,
    borderRadius: 4,
  },
  confData: {
    flexDirection: 'column',
    paddingBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: Colors.lightFG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: {
    fontSize: 16,
  },
  qrAus: {
    fontSize: 16,
    color: Colors.errorBackground,
  },
  actContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  msgs: {
    fontSize: 16,
    color: Colors.lightColor,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 24,
    bottom: 24,
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(EventOrgData);
