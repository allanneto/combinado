/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, Alert, Image} from 'react-native';

import {Icon} from 'react-native-elements';
import {Text, Button} from 'react-native-paper';

import moment from 'moment';
import isAfter from 'date-fns/isAfter';

import Colors from '~/config/Colors';
import {createNotification, updateNotifica} from '~/services/notificaApi';
import {getEvent} from '~/services/eventsApi';
import {insertWork, getWork, workAloc} from '~/services/worksApi';
import {encodeParam} from '~/services/utils';

import {getJob} from '~/services/jobsApi';
import {readUser} from '~/services/usersApi';

const ButtonBar = ({
  sta,
  userDetail,
  eventDetail,
  acceptUser,
  rejectUser,
  acceptInvite,
  rejectInvite,
  working,
  startChat,
}) => {
  if (sta === 0) {
    return (
      <>
        {working && (
          <View style={styles.msgBar}>
            <Text style={styles.htext}>A g u a r d e . . .</Text>
          </View>
        )}
        <View style={styles.cmdBar}>
          <Button
            compact
            uppercase={false}
            icon="close"
            mode="contained"
            color={Colors.errorBackground}
            onPress={rejectUser}
            disabled={working}>
            Rejeita
          </Button>
          <Button
            compact
            uppercase={false}
            icon="magnify"
            mode="contained"
            color={Colors.secColor}
            onPress={userDetail}
            disabled={working}>
            Sobre
          </Button>
          <Button
            compact
            uppercase={false}
            icon="comment-multiple-outline"
            mode="contained"
            color={Colors.secColor}
            onPress={startChat}
            disabled={working}>
            Chat
          </Button>
          <Button
            compact
            uppercase={false}
            icon="check"
            mode="contained"
            color={Colors.mainColor}
            onPress={acceptUser}
            disabled={working}>
            Aceita
          </Button>
        </View>
      </>
    );
  } else if (sta === 5) {
    return (
      <View style={styles.cmdBar}>
        <Button
          compact
          uppercase={false}
          icon="comment-multiple-outline"
          mode="contained"
          color={Colors.secColor}
          onPress={startChat}>
          Chat
        </Button>
      </View>
    );
  } else {
    return (
      <>
        {working && (
          <View style={styles.msgBar}>
            <Text style={styles.htext}>A g u a r d e . . .</Text>
          </View>
        )}
        <View style={styles.cmdBar}>
          <Button
            compact
            uppercase={false}
            icon="close"
            mode="contained"
            color={Colors.errorBackground}
            onPress={rejectInvite}
            disabled={working}>
            Rejeitar
          </Button>
          <Button
            compact
            uppercase={false}
            icon="magnify"
            mode="contained"
            color={Colors.secColor}
            onPress={eventDetail}
            disabled={working}>
            Evento
          </Button>
          <Button
            compact
            uppercase={false}
            icon="check"
            mode="contained"
            color={Colors.mainColor}
            onPress={acceptInvite}
            disabled={working}>
            Aceitar
          </Button>
        </View>
      </>
    );
  }
};

class NotificationData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      working: false,
      // notification: null,
      user: null,
      team: null,
      event: null,
      job: null,
      observ: '',
    };
  }

  async componentDidMount() {
    const {notification, onNavigateBack} = this.props.navigation.state.params;
    let event;
    let job;
    try {
      // status = 3 - estou sendo convidado. Se não - solicitacao de prestador
      if (notification.sta === 3) {
        event = await getEvent(notification.ema, notification.dat);
        job = await getJob(
          notification.ema,
          notification.dat,
          notification.tsk,
        );
      } else {
        event = await getEvent(notification.dst, notification.dat);
        job = await getJob(
          notification.dst,
          notification.dat,
          notification.tsk,
        );
      }
    } catch (err) {
      event = null;
      job = null;
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      notification,
      event: event ? event : null,
      job: job ? job : null,
      pic: notification.pic,
      onNavigateBack,
      user: this.props.auth.user,
      skill_name: notification.tsk,
      skill: notification.tsk,
      loaded: true,
    });
  }

  static navigationOptions = {
    title: 'Notificação',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  acceptUser = () => {
    Alert.alert('Confirme a aceitação', 'A vaga será aceita', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.setEventAccept();
        },
      },
    ]);
  };

  // Aceita solicitação
  setEventAccept = async () => {
    const {dst, dat, tms, rem, tsk} = this.state.notification;
    const event = this.state.event;

    this.setState({working: true});

    const job = await getJob(dst, dat, tsk);

    // Verifica se ja não foi aceito no mesmo horario em evento
    const query = encodeParam({
      ema: rem,
      ini: this.state.event.ini,
      fim: this.state.event.fim,
    });
    const works = await workAloc(query);
    if (works && works.length > 0) {
      Alert.alert(
        'Aviso',
        'Prestador já incluído em um trabalho no mesmo horário',
      );
      this.setState({working: false});
      return;
    }

    // Verifica se ainda há vagas
    const qpr = job.qpr || 0;
    if (qpr >= job.qtd) {
      Alert.alert('Aviso', 'Vagas já foram preenchidas');
      this.state.onNavigateBack();
      this.props.navigation.goBack();
      this.setState({working: false});
      return;
    }
    // Verifica se ja foi incluido na vaga
    const work = await getWork(rem, event.dat, event.ema, tsk);
    if (work && work.emp) {
      Alert.alert('Aviso', 'Prestador já incluido na vaga');
      this.setState({working: false});
      return;
    }
    // Incluir na vaga e excluir notificação
    try {
      const user = await readUser(rem);
      const data = {
        emp: rem,
        dat: event.dat,
        ema: event.ema,
        tsk: tsk,
        pic: job.pic,
        pip: user.pic,
        nop: user.nom,
        val: job.val,
        tit: event.tit,
        ini: event.ini,
        fim: event.fim,
        nom: event.nom,
        reg: event.reg,
      };
      await insertWork(data);
      const when = moment(event.ini).format('DD/MM/YYYY HH:mm');
      const msgs = `Sua solicitação de vaga em ${when} foi aceita`;
      await createNotification(rem, msgs, event.tit, user, event, tsk, 1);
      await updateNotifica({
        dst,
        tms,
        sta: 5,
        dat: event.dat,
        ema: event.ema,
        tit: 'Solicitação aceita',
      });
      this.setState({working: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  acceptInvite = () => {
    Alert.alert('Confirme a aceitação', 'O convite será aceito', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.setInviteAccept();
        },
      },
    ]);
  };

  // Aceita convite
  setInviteAccept = async () => {
    const {dst, dat, tms, rem, tsk} = this.state.notification;
    const event = this.state.event;

    this.setState({working: true});

    const job = await getJob(rem, dat, tsk);

    // Verifica se ja não foi aceito no mesmo horario em evento
    const query = encodeParam({
      ini: this.state.event.ini,
      fim: this.state.event.fim,
    });
    const works = await workAloc(query);
    if (works && works.length > 0) {
      Alert.alert('Aviso', 'Já foi incluído em um trabalho no mesmo horário');
      this.setState({working: false});
      return;
    }

    // Verifica se ainda há vagas
    const qpr = job.qpr || 0;
    if (qpr >= job.qtd) {
      Alert.alert('Aviso', 'Vagas já foram preenchidas');
      this.state.onNavigateBack();
      this.props.navigation.goBack();
      this.setState({working: false});
      return;
    }
    // Verifica se ja tinha sido incluido na vaga
    const work = await getWork(dst, event.dat, event.ema, tsk);
    if (work && work.emp) {
      Alert.alert('Aviso', 'Já incluido na vaga');
      this.setState({working: false});
      return;
    }
    // Incluir na vaga e excluir notificação
    try {
      const user = await readUser(dst);
      const data = {
        emp: dst,
        dat: event.dat,
        ema: event.ema,
        tsk: tsk,
        pic: job.pic,
        pip: user.pic,
        nop: user.nom,
        val: job.val,
        tit: event.tit,
        ini: event.ini,
        fim: event.fim,
        nom: event.nom,
        reg: event.reg,
      };
      await insertWork(data);
      const when = moment(event.ini).format('DD/MM/YYYY HH:mm');
      const msgs = `Seu convite para vaga em ${when} foi aceito`;
      await createNotification(rem, msgs, event.tit, user, event, tsk, 1);
      await updateNotifica({
        dst,
        tms,
        dat: event.dat,
        ema: event.ema,
        sta: 5,
        tit: 'Convite aceito',
      });
      this.setState({working: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  rejectInvite = () => {
    Alert.alert('Confirme a rejeição', 'O convite será rejeitado', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.setInviteReject();
        },
      },
    ]);
  };

  // Rejeita convite
  setInviteReject = async () => {
    // Rejeitar convite e excluir notificação
    this.setState({working: true});
    try {
      const {dst, tms, rem, tsk} = this.state.notification;
      const user = await readUser(rem);
      const event = this.state.event; // await getEvent(userId, eventId)
      await updateNotifica({
        dst,
        dat: event.dat,
        ema: event.ema,
        tms,
        sta: 5,
        tit: 'Convite rejeitado',
      });
      await createNotification(
        rem,
        'Convite rejeitado',
        event.tit,
        user,
        event,
        tsk,
        2,
      );

      this.setState({working: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  rejectUser = () => {
    Alert.alert(
      'Confirme a rejeição',
      'O prestador será rejeitado para a vaga',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            this.setEventReject();
          },
        },
      ],
    );
  };

  // Rejeita solicitação
  setEventReject = async () => {
    this.setState({working: true});
    try {
      const {dst, tms, rem, tsk} = this.state.notification;
      const user = await readUser(dst);
      const event = this.state.event; // await getEvent(userId, eventId)
      await updateNotifica({
        dst,
        tms,
        dat: event.dat,
        ema: event.ema,
        sta: 5,
        tit: 'Solicitação rejeitada',
      });
      await createNotification(
        rem,
        'Solicitação rejeitada',
        event.tit,
        user,
        event,
        tsk,
        2,
      );

      this.setState({working: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  getHour(dta) {
    return moment(dta).format('DD/MM/YYYY HH:mm:ss');
  }

  userDetail = () => {
    this.props.navigation.navigate('UserData', {
      ema: this.state.notification.rem,
    });
  };

  eventDetail = () => {
    this.props.navigation.navigate('EventOrgData', {
      ema: this.state.notification.ema,
      dat: this.state.notification.dat,
      tsk: this.state.notification.tsk,
      val: this.state.job.val,
      pic: this.state.job.pic,
      insert: false,
      ro: true,
    });
  };

  changeValue = (item, value) => {
    this.setState({
      [item]: value,
      error: null,
    });
  };

  // sendMessage = async () => {
  //   const {userId, ntfTime, skill} = this.state.notification;
  //   createMessage(
  //     this.state.user,
  //     this.state.event.userId,
  //     this.state.event.tit,
  //     this.state.texto,
  //     this.state.event,
  //     skill,
  //     4,
  //   );
  //   await updateNotifica({userId, ntfTime, sta: 5});
  //   this.props.navigation.goBack();
  // };

  startChat = async sta => {
    const agora = new Date();
    const ini = new Date(this.state.event.ini);
    this.props.navigation.navigate('EventChat', {
      event: this.state.event,
      work: true,
      ro: !isAfter(ini, agora) || sta === 5,
      job: this.state.notification.tsk, //this.state.job,
      destId: this.state.notification.rem,
    });

    // this.props.navigation.navigate('ChatView', {
    //   notification: this.state.notification,
    //   msgId: this.state.notification.msgId,
    // });
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.listStyle}>
              <View style={styles.bodyHeader}>
                {this.state.notification.sta !== 7 && (
                  <Image source={{uri: this.state.pic}} style={styles.icon} />
                )}
                <View style={styles.subhead}>
                  <Text style={styles.textHeader}>
                    {this.state.notification.nom}
                  </Text>
                  <View style={styles.dateComp}>
                    <Icon
                      name="clock-o"
                      type="font-awesome"
                      color={Colors.lightColor}
                      size={12}
                    />
                    <Text style={styles.date}>
                      {this.getHour(this.state.notification.tms)}
                    </Text>
                  </View>
                </View>
              </View>
              {this.state.notification.sta !== 4 || !this.state.texto ? (
                <View
                  style={{
                    marginBottom: 8,
                    marginTop: 8,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: Colors.tabIconDefault,
                  }}>
                  <Text style={styles.title}>
                    {this.state.notification.tit}
                  </Text>
                  {this.state.notification.sta !== 7 && (
                    <>
                      <Text style={styles.htext}>Vaga</Text>
                      <Text style={styles.text}>
                        {this.state.notification.tsk}
                      </Text>
                      <Text style={styles.htext}>Trabalho</Text>
                      <Text style={styles.text}>
                        {this.state.notification.txt}
                      </Text>
                    </>
                  )}
                </View>
              ) : null}

              {/* {this.state.event &&
              this.state.notification.sta === 4 &&
              this.state.texto ? (
                <View style={styles.cmdBar}>
                  <Button
                    uppercase={false}
                    icon="email"
                    mode="contained"
                    color={Colors.mainColor}
                    onPress={this.sendMessage}>
                    Enviar resposta
                  </Button>
                </View>
              ) : null}
              {this.state.event && this.state.notification.sta === 4 ? (
                <View style={styles.formContainer}>
                  <TextInput
                    label="Resposta"
                    multiline
                    mode="outlined"
                    value={this.state.texto}
                    onChangeText={text => this.changeValue('texto', text)}
                  />
                  <View style={{paddingTop: 4}}>
                    <Text style={styles.date}>
                      Entre com a resposta com quantas linhas desejar.
                    </Text>
                  </View>
                </View>
              ) : null} */}
            </View>
          </ScrollView>

          {this.state.notification.sta === 0 ||
          this.state.notification.sta === 3 ||
          this.state.notification.sta === 5 ? (
            <ButtonBar
              sta={this.state.notification.sta}
              userDetail={this.userDetail}
              eventDetail={this.eventDetail}
              acceptUser={this.acceptUser}
              rejectUser={this.rejectUser}
              acceptInvite={this.acceptInvite}
              rejectInvite={this.rejectInvite}
              working={this.state.working}
              startChat={() => this.startChat(this.state.notification.sta)}
            />
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
  },
  header: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  listStyle: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.lightFG,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  formContainer: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  // cmdBar: {
  //   flexDirection: 'column',
  //   padding: 8,
  //   justifyContent: 'center'
  // },
  contentContainer: {
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    marginBottom: 10,
    borderTopColor: 'silver',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cmdContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 16,
    paddingTop: 16,
    borderTopColor: Colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingTop: 16,
    borderTopColor: Colors.tabBar,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  bodyHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  icon: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    width: 36,
    height: 36,
  },
  subhead: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  textHeader: {
    fontSize: 16,
  },
  dateComp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
    color: Colors.lightColor,
  },
  title: {
    fontSize: 17,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 24,
    bottom: 24,
  },
  htext: {
    fontSize: 14,
    marginHorizontal: 12,
    marginBottom: 4,
    marginTop: 4,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    marginHorizontal: 12,
    marginBottom: 4,
  },
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  msgBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(NotificationData);
