/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {ListItem, Icon} from 'react-native-elements';
import {Text, Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDateISO} from '~/locales/format';
import isAfter from 'date-fns/isAfter';
import differenceInHours from 'date-fns/differenceInHours';
import {encodeParam} from '~/services/utils';
const numbro = require('numbro');
let ptbr = require('numbro/dist/languages/pt-BR.min');
numbro.registerLanguage(ptbr, true);
numbro.setLanguage('pt-BR');
import moment from 'moment';

import {
  sendNotification,
  canSendNotifica,
  createNotification,
} from '~/services/notificaApi';
import {
  updateEvent,
  getEvent,
  isEventRO,
  isEventBlocked,
  getSkillName,
  cancelEvent,
  deleteEvent,
  activateEvent,
  insertEvent,
} from '~/services/eventsApi';
import {listWork} from '~/services/worksApi';

import Colors from '~/config/Colors';

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
      ini: '',
      end: '',
      ini2: '',
      end2: '',
      iniVisible: false,
      endVisible: false,
      save: false,
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
    const {email, dat, insert} = this.props.navigation.state.params;
    this.requestFineLocation();
    let agora = new Date().toISOString();
    if (insert) {
      const event = {
        // userId: this.props.auth.user.userId,
        // eventId: uuidv4(),
        // dat: agora,
        // nom: this.props.auth.user.nom,
        // ema: this.props.auth.user.ema,
        // pic: this.props.auth.user.pic,
        sta: 0,
        cel: this.props.auth.user.cel,
        reg: this.props.auth.user.reg,
        pgm: 'd',
      };
      this.setState({
        event: event,
        loaded: true,
        insert: insert,
        ro: false,
      });
    } else {
      getEvent(email, dat).then(event => {
        agora = new Date();
        const ini = new Date(event.ini);
        const fim = new Date(event.fim);
        this.setState({
          event: event,
          past: isAfter(agora, fim),
          present: isAfter(agora, ini) && isAfter(fim, agora),
          future: isAfter(ini, agora),
          loaded: true,
          insert: insert,
          user: this.props.auth.user,
          ini2: formatDateISO(event.ini, 'P p'),
          end2: formatDateISO(event.fim, 'P p'),
          ro: event.sta !== 0 || event.sta === 3,
        });
      });
    }
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

  eventCanSave = () => {
    const evt = this.state.event;
    const fields = [
      !this.state.ro,
      evt.tit || false,
      evt.cel || false,
      evt.loc || false,
      evt.ini || false,
      evt.fim || false,
    ];
    return fields.every(ele => ele);
  };

  eventCanActivate = () => {
    const today = new Date();
    const ini = new Date(this.state.event.ini);
    const fim = new Date(this.state.event.fim);
    const past = isAfter(today, fim);
    const present = isAfter(today, ini) && !isAfter(today, fim);
    if (present || past) {
      return false;
    }
    const evt = this.state.event;
    const fields = [
      evt.tit || false,
      evt.cel || false,
      evt.loc || false,
      evt.ini || false,
      evt.fim || false,
      evt.pgm || false,
      evt.tsk && evt.tsk.length > 0,
    ];
    return evt.sta === 0 && fields.every(ele => ele);
  };

  eventCanCancel = () => {
    const today = new Date();
    const ini = new Date(this.state.event.ini);
    return isAfter(ini, today) && this.state.event.sta === 1;
  };

  eventCanDelete = () => {
    if (this.state.insert) {
      return false;
    }
    return this.state.event.sta === 0;
  };

  eventCanClose = () => {
    const today = new Date();
    const ini = new Date(this.state.event.ini);
    return !isAfter(ini, today) && this.state.event.sta === 1;
  };

  eventCanChat = () => {
    const today = new Date();
    const ini = new Date(this.state.event.ini);
    return isAfter(ini, today);
  };

  setValue = (item, value) => {
    this.setState(prevState => ({
      save: true,
      event: {
        ...prevState.event,
        [item]: value,
      },
    }));
  };

  setLocal = (loc, geo) => {
    this.setState(prevState => ({
      event: {
        ...prevState.event,
        loc: loc,
        geo: geo,
      },
    }));
  };

  getTasks = () => {
    if (this.state.event.tsk) {
      const pos = this.state.event.tsk.length;
      const tot = this.state.event.tsk.reduce((p, r) => p + r.qtd, 0);
      return `${tot} vagas para ${pos} serviços`;
    }
    return 'Nenhuma vaga criada ainda';
  };

  deleteEvent = async () => {
    Alert.alert(
      'Confirme a exclusão',
      'O registro sertá excluído e não poderá mais ser recuperado',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            this.setEventDelete();
          },
        },
      ],
    );
  };

  setEventDelete = async () => {
    try {
      deleteEvent(this.state.event.ema, this.state.event.dat);
      this.props.navigation.state.params.onNavigateBack();
      this.props.navigation.goBack(this.state.nav);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  cancelEvent = () => {
    Alert.alert('Confirme o cancelamento', 'O evento será cancelado', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.setEventCancel();
        },
      },
    ]);
  };

  setEventCancel = async () => {
    // const ema = this.state.event.ema;
    // const dat = this.state.event.dat;
    this.setState({working: true});
    try {
      const queryParams = {
        ema: this.state.event.ema,
        dat: this.state.event.dat,
      };
      const query = encodeParam(queryParams);
      const team = await listWork(query);
      if (team && team.length > 0) {
        // eslint-disable-next-line no-unused-vars
        for (const reg of team) {
          createNotification(
            this.props.auth.user,
            reg.userId,
            this.state.event,
            reg.skill,
            'Evento foi cancelado',
            2,
          );
        }
      }
    } catch (err) {
      __DEV__ ? console.tron.log('ERRO', err) : console.log(err);
    }
    try {
      await cancelEvent(this.state.event);
      this.setValue('sta', 0);
      this.props.navigation.state.params.onNavigateBack();
      this.setState({working: false});
      this.props.navigation.state.params.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  activateEventNow = async () => {
    Alert.alert(
      'Confirme a publicação',
      'Vagas serão publicadas e notificações serão enviadas',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            this.setEventActivate();
          },
        },
      ],
    );
  };

  eventConsistent = () => {
    if (!this.eventCanSave()) {
      this.setState({working: false});
      Alert.alert(
        'Erro',
        'Registro incompleto. Informar título, telefone, local e datas',
      );
      return false;
    }

    const agora = new Date();
    const ini = new Date(this.state.event.ini);
    const fim = new Date(this.state.event.fim);
    const dif = differenceInHours(fim, ini);
    const idif = differenceInHours(ini, agora);

    if (isAfter(ini, fim)) {
      this.setState({working: false});
      Alert.alert('Erro', 'Data/hora final deve ser maior que inicial');
      return false;
    }
    if (isAfter(agora, fim)) {
      this.setState({working: false});
      Alert.alert('Erro', 'Data/hora do evento não pode ter passado');
      return false;
    }
    if (dif < 1 || dif > 12) {
      this.setState({working: false});
      Alert.alert(
        'Erro',
        `Duração do evento deve estar entre 1 hora a 12 horas. Deu ${dif}h`,
      );
      return false;
    }
    if (!__DEV__ && idif < 1) {
      this.setState({working: false});
      Alert.alert(
        'Erro',
        'Hora de início muito próxima. Início deve ser em pelo menos uma hora',
      );
      return false;
    }
    return true;
  };

  setEventActivate = async (activate = true) => {
    if (activate && !this.eventConsistent()) {
      return;
    }
    if (activate && !this.eventCanActivate()) {
      Alert.alert('Erro', 'Evento incompleto. Campos em branco?');
      return;
    }
    this.setState({working: true});
    const texto = `Novas vagas foram publicadas para o evento ${
      this.state.event.tit
    }`;
    const skills = this.state.event.tsk.map(tsk => tsk.key);
    try {
      if (activate) {
        await activateEvent(this.state.event);
      }

      if (this.state.event.reg) {
        sendNotification(
          'Novas vagas!',
          texto,
          null,
          this.state.event.reg,
          skills,
        );
      }

      if (activate) {
        this.setValue('sta', 1);
        this.setState({working: false});
        this.props.navigation.state.params.onNavigateBack();
        this.props.navigation.goBack();
      }
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  closeEventAval = () => {
    this.setState({working: true});
    this.props.navigation.navigate('EventClose', {
      event: this.state.event,
      nav: this.props.navigation.state.key,
      onChange: this.setValue,
      onNavigateBack: this.props.navigation.state.params.onNavigateBack,
    });
    this.setState({working: false});
  };

  chatEvent = () => {
    this.props.navigation.navigate('EventChat', {
      event: this.state.event,
      ro: !this.eventCanChat(),
      work: false,
    });
  };

  getSkill = cod => {
    if (!cod) {
      return '';
    } else {
      return `- ${getSkillName(cod)}`;
    }
  };

  canChat = async () => {
    if (this.state.work) {
      return true;
    }
    if (
      this.state.past ||
      !this.state.job ||
      isEventBlocked(this.state.event)
    ) {
      return false;
    }
    const notif = await canSendNotifica(
      this.state.event.eventId,
      this.state.user.userId,
    );
    if (notif.length > 0) {
      return true;
    }
    return false;
  };

  handleSendMessage = async () => {
    // const canChat = await this.canChat()
    // if (!canChat) {
    //   Alert.alert(
    //     'Aviso',
    //     `Você não solicitou vaga nem está inscrito como ${getSkillName(
    //       this.state.job
    //     )} neste evento.`
    //   )
    //   return
    // }
    this.props.navigation.navigate('EventChat', {
      event: this.state.event,
      work: false,
      ro: !this.eventCanChat(),
      job: this.state.job,
    });
  };

  getDate = data => {
    const dta = data ? new Date(data) : new Date();
    return dta;
  };

  handleDateIni = date => {
    const ini2 = formatDateISO(date.toISOString(), 'P p');
    this.setState({ini2, iniVisible: false, save: true});
    this.setValue('ini', date.toISOString());

    if (!this.state.end2) {
      const end2 = formatDateISO(date.toISOString(), 'P p');
      this.setState({end2, endVisible: false, save: true});
      this.setValue('fim', date.toISOString());
    }
  };

  handleDateEnd = date => {
    const end2 = formatDateISO(date.toISOString(), 'P p');
    this.setState({end2, endVisible: false, save: true});
    this.setValue('fim', date.toISOString());
  };

  handleSaveEvent = async () => {
    if (!this.eventConsistent()) {
      return;
    }
    this.setState({working: true});
    let event = this.state.event;
    try {
      if (this.state.insert) {
        event = await insertEvent(this.state.event);
      } else {
        await updateEvent(this.state.event);
      }
      this.setState({working: false, insert: false, save: false, event});
      // Alert.alert('OK', 'Registro do Evento foi gravado')
      this.props.navigation.navigate('EventOrgTasks', {
        event: event,
        onChange: this.setValue,
        ro: isEventRO(this.state.event) || this.state.ro,
        setActivate: this.setEventActivate,
        onNavigateBack: this.props.navigation.state.params.onNavigateBack,
      });
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  totValor = () => {
    if (this.state.event.tot || this.state.event.tot === 0) {
      return (
        'R$ ' +
        numbro(parseFloat(this.state.event.tot)).format({
          thousandSeparated: true,
          mantissa: 2,
        })
      );
    } else {
      const tsk = this.state.event.tsk || [];
      const tot = tsk.reduce((p, r) => p + r.val * r.qtd, 0);
      return (
        'R$ ' +
        numbro(parseFloat(tot)).format({
          thousandSeparated: true,
          mantissa: 2,
        })
      );
    }
  };

  totPagar = () => {
    if (this.state.event.val || this.state.event.val === 0) {
      return (
        'R$ ' +
        numbro(parseFloat(this.state.event.tot)).format({
          thousandSeparated: true,
          mantissa: 2,
        })
      );
    } else {
      return '';
    }
  };

  dataPag = () => {
    return this.state.event.dtp
      ? moment(this.state.event.dtp).format('DD/MM/YYYY HH:mm')
      : '';
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View style={styles.form}>
              {!this.state.insert ? (
                <ListItem
                  leftIcon={{
                    name: 'people',
                    type: 'material-icons',
                    color: Colors.mainColor,
                  }}
                  title="Vagas"
                  bottomDivider
                  chevron
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                  subtitle={this.getTasks()}
                  onPress={() =>
                    this.props.navigation.navigate('EventOrgTasks', {
                      event: this.state.event,
                      onChange: this.setValue,
                      setActivate: this.setEventActivate,
                      dirty: this.state.save,
                      ro: isEventRO(this.state.event) || this.state.ro,
                      onNavigateBack: this.props.navigation.state.params
                        .onNavigateBack,
                    })
                  }
                />
              ) : null}

              {this.state.event.sta === 2 || this.state.event.stp === 2 ? (
                <ListItem
                  leftIcon={{
                    name: 'attach-money',
                    type: 'material-icons',
                    color: Colors.mainColor,
                  }}
                  title="Pagamento"
                  bottomDivider
                  chevron
                  subtitleStyle={
                    this.state.event.stp === 1 || this.state.event.stp === 2
                      ? {
                          color: Colors.bluish,
                          fontWeight: 'bold',
                        }
                      : {
                          color: Colors.errorBackground,
                          fontWeight: 'bold',
                        }
                  }
                  subtitle={this.state.event.msg || 'Confirmado'}
                  onPress={() =>
                    this.props.navigation.navigate('EventClose', {
                      event: this.state.event,
                      nav: this.props.navigation.state.key,
                      ro: true,
                      onChange: this.setValue,
                      onNavigateBack: this.props.navigation.state.params
                        .onNavigateBack,
                    })
                  }
                />
              ) : null}

              <TextInput
                label="Título do evento"
                value={this.state.event.tit}
                editable={!this.state.ro}
                style={{marginBottom: 8, backgroundColor: 'white'}}
                onChangeText={text => this.setValue('tit', text)}
              />
              <TextInput
                label="Descrição do evento"
                value={this.state.event.des}
                editable={!this.state.ro}
                multiline
                style={{marginBottom: 8, backgroundColor: 'white'}}
                onChangeText={text =>
                  !this.state.ro ? this.setValue('des', text) : null
                }
              />

              <TextInput
                label="Telefone para contato"
                value={this.state.event.cel}
                editable={!this.state.ro}
                style={{marginBottom: 8, backgroundColor: 'white'}}
                onChangeText={text =>
                  !this.state.ro ? this.setValue('cel', text) : null
                }
              />

              <TouchableOpacity
                style={styles.pickerStyle}
                onPress={() =>
                  this.props.navigation.navigate('EventAddr', {
                    event: this.state.event,
                    onChange: this.setValue,
                    ro: this.state.ro,
                  })
                }>
                <Text style={styles.label}>Local</Text>
                {this.state.event.loc ? (
                  <Text>{this.state.event.loc}</Text>
                ) : (
                  <Text>Endereço</Text>
                )}
              </TouchableOpacity>

              <TextInput
                label="Numero"
                value={this.state.event.num}
                editable={!this.state.ro}
                style={{marginBottom: 8, backgroundColor: 'white'}}
                onChangeText={text =>
                  !this.state.ro ? this.setValue('num', text) : null
                }
              />
              <TextInput
                label="Complemento"
                value={this.state.event.cpl}
                editable={!this.state.ro}
                style={{marginBottom: 8, backgroundColor: 'white'}}
                onChangeText={text =>
                  !this.state.ro ? this.setValue('cpl', text) : null
                }
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={styles.pickerStyle}
                  onPress={() =>
                    !this.state.ro
                      ? this.setState({iniVisible: true})
                      : this.setState({iniVisible: false})
                  }>
                  <Text style={styles.label}>Data/Hora inicial</Text>
                  {this.state.ini2 ? (
                    <Text style={styles.input}>{this.state.ini2}</Text>
                  ) : (
                    <Text>Data/hora</Text>
                  )}
                </TouchableOpacity>
                <DateTimePickerModal
                  date={this.getDate(this.state.event.ini)}
                  isVisible={this.state.iniVisible}
                  onConfirm={this.handleDateIni}
                  onCancel={() => this.setState({iniVisible: false})}
                  titleIOS="Escolha uma data e hora"
                  confirmTextIOS="OK"
                  locale="pt_BR"
                  mode="datetime"
                />

                <TouchableOpacity
                  style={styles.pickerStyle}
                  onPress={() =>
                    !this.state.ro
                      ? this.setState({endVisible: true})
                      : this.setState({endVisible: false})
                  }>
                  <Text style={styles.label}>Data/Hora final</Text>
                  {this.state.end2 ? (
                    <Text style={styles.input}>{this.state.end2}</Text>
                  ) : (
                    <Text>Data/hora</Text>
                  )}
                </TouchableOpacity>
                <DateTimePickerModal
                  date={this.getDate(this.state.event.fim)}
                  isVisible={this.state.endVisible}
                  onConfirm={this.handleDateEnd}
                  onCancel={() => this.setState({endVisible: false})}
                  titleIOS="Escolha uma data e hora"
                  confirmTextIOS="OK"
                  locale="pt_BR"
                  mode="datetime"
                />
              </View>
              <View style={{marginTop: 8}}>
                <Text style={styles.label2}>Forma de pagamento</Text>
              </View>

              {this.state.ro && this.state.event.pgm === 'c' && (
                <>
                  <View style={styles.infoBar}>
                    <Button
                      compact
                      mode={'text'}
                      uppercase={false}
                      icon="credit-card"
                      color={Colors.mainColor}>
                      Cartão
                    </Button>
                    <View>
                      <Text>{`**** **** **** ${
                        this.state.user.crn.split(' ')[3]
                      }`}</Text>
                    </View>
                  </View>
                  <View style={styles.infoVal}>
                    <Text style={styles.label}>Valor previsto</Text>
                    <Text style={styles.label}>Valor pago</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text>{this.totValor()}</Text>
                    <Text>{this.totPagar()}</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text />
                    <Text>{this.dataPag()}</Text>
                  </View>
                </>
              )}
              {this.state.ro && this.state.event.pgm === 'b' && (
                <>
                  <View style={styles.infoBar}>
                    <Button
                      compact
                      mode={'text'}
                      uppercase={false}
                      icon="barcode-scan"
                      color={Colors.mainColor}>
                      Boleto
                    </Button>
                  </View>
                  <View style={styles.infoVal}>
                    <Text style={styles.label}>Valor previsto</Text>
                    <Text style={styles.label}>Valor pago</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text>{this.totValor()}</Text>
                    <Text>{this.totPagar()}</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text />
                    <Text>{this.dataPag()}</Text>
                  </View>
                </>
              )}
              {this.state.ro && this.state.event.pgm === 'd' && (
                <>
                  <View style={styles.infoBar}>
                    <Button
                      compact
                      mode={'text'}
                      uppercase={false}
                      icon="cash-multiple"
                      color={Colors.mainColor}>
                      Dinheiro
                    </Button>
                  </View>
                  <View style={styles.infoVal}>
                    <Text style={styles.label}>Valor previsto</Text>
                    <Text style={styles.label}>Valor pago</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text>{this.totValor()}</Text>
                    <Text>{this.totPagar()}</Text>
                  </View>
                  <View style={styles.infoVal}>
                    <Text />
                    <Text>{this.dataPag()}</Text>
                  </View>
                </>
              )}

              {!this.state.ro && (
                <View style={[styles.cmdBar, {backgroundColor: Colors.white}]}>
                  <Button
                    compact
                    mode={this.state.event.pgm === 'c' ? 'contained' : 'text'}
                    uppercase={false}
                    icon="credit-card"
                    color={
                      this.state.event.pgm === 'c'
                        ? Colors.tabBar
                        : Colors.mainColor
                    }
                    disabled={this.state.working}
                    // disabled
                    onPress={() =>
                      !this.state.ro ? this.setValue('pgm', 'c') : null
                    }>
                    Cartão
                  </Button>
                  <Button
                    compact
                    mode={this.state.event.pgm === 'b' ? 'contained' : 'text'}
                    uppercase={false}
                    icon="barcode-scan"
                    color={
                      this.state.event.pgm === 'b'
                        ? Colors.tabBar
                        : Colors.mainColor
                    }
                    disabled={this.state.working}
                    onPress={() =>
                      !this.state.ro ? this.setValue('pgm', 'b') : null
                    }>
                    Boleto
                  </Button>
                  <Button
                    compact
                    mode={this.state.event.pgm === 'd' ? 'contained' : 'text'}
                    uppercase={false}
                    icon="cash-multiple"
                    color={
                      this.state.event.pgm === 'd'
                        ? Colors.tabBar
                        : Colors.mainColor
                    }
                    disabled={this.state.working}
                    onPress={() =>
                      !this.state.ro ? this.setValue('pgm', 'd') : null
                    }>
                    Dinheiro
                  </Button>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.cmdBar}>
            {!this.state.ro && this.state.save && this.eventCanSave() && (
              <Button
                compact
                uppercase={false}
                icon="check"
                mode="contained"
                color={Colors.mainColor}
                disabled={this.state.working}
                onPress={this.handleSaveEvent}>
                Salvar
              </Button>
            )}
            {this.state.event.sta !== 0 && (
              <Button
                compact
                uppercase={false}
                icon="comment-multiple-outline"
                mode="contained"
                color={Colors.secColor}
                disabled={this.state.working}
                onPress={this.handleSendMessage}>
                Chats
              </Button>
            )}
            {this.eventCanClose() && (
              <Button
                compact
                uppercase={false}
                icon="exit-to-app"
                mode="contained"
                color={Colors.mainColor}
                disabled={this.state.working}
                onPress={() => this.closeEventAval()}>
                Encerrar
              </Button>
            )}
            {!this.state.save && this.eventCanActivate() && (
              <Button
                compact
                uppercase={false}
                icon="check"
                mode="contained"
                color={Colors.secColor}
                disabled={this.state.working}
                onPress={() => this.activateEventNow()}>
                Publicar
              </Button>
            )}
            {this.eventCanCancel() && (
              <Button
                compact
                uppercase={false}
                icon="close"
                mode="contained"
                color={Colors.mainColor}
                disabled={this.state.working}
                onPress={() => this.cancelEvent()}>
                Cancelar
              </Button>
            )}
            {this.eventCanDelete() && (
              <Button
                compact
                uppercase={false}
                icon="delete"
                mode="contained"
                color={Colors.errorBackground}
                disabled={this.state.working}
                onPress={() => this.deleteEvent()}>
                Excluir
              </Button>
            )}
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
    backgroundColor: '#fff',
  },
  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    marginTop: 0,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    backgroundColor: Colors.lightBG,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  infoBar: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderColor: Colors.lightFG,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoVal: {
    flexDirection: 'row',
    paddingBottom: 2,
    paddingTop: 4,
    borderTopWidth: 0,
    backgroundColor: Colors.white,
    borderColor: Colors.lightFG,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: 12,
    color: '#444',
    marginBottom: 4,
  },
  label2: {
    fontSize: 12,
    color: '#444',
    paddingLeft: 12,
    marginBottom: 4,
    marginTop: 16,
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
  pickerStyle: {
    padding: 8,
    paddingLeft: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBar,
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
