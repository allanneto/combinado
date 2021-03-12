/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {Text, TextInput, Button} from 'react-native-paper';

import Colors from '~/config/Colors';
import {listWork} from '~/services/worksApi';

import {createChatMessage} from '~/services/notificaApi';
import {chatCreate} from '~/services/chatApi';
import {encodeParam} from '~/services/utils';

class ChatMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      working: false,
      notification: null,
      user: null,
      titulo: '',
      texto: '',
      jobId: '',
      userId: '',
    };
  }

  componentDidMount() {
    const {
      event,
      refresh,
      work,
      job,
      destId,
      chats,
    } = this.props.navigation.state.params;
    const jobs = event.tsk.map(t => ({
      key: t.key,
      name: t.key,
    }));
    const usrs = [];

    const queryParams = {
      ema: event.ema,
      dat: event.dat,
    };
    const query = encodeParam(queryParams);
    // emails dos prestadores que ja iniciaram chat aqui, Filtrados para não iniciar novo chat
    const achats = chats.map(r => r.msgId.split('#')[3]);
    listWork(query).then(res => {
      res.Items.filter(it => achats.indexOf(it.emp) !== -1).map(reg =>
        usrs.push({
          key: reg.emp,
          name: `${reg.nop} (${reg.tsk})`,
          name2: `${reg.nom}`,
          pic: `${reg.pip}`,
        }),
      );
      this.setState({
        event,
        jobs,
        usrs,
        user: this.props.auth.user,
        loaded: true,
        refresh,
        work,
        job,
        destId,
      });
    });
  }

  static navigationOptions = {
    title: 'Mensagem',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeValue = (item, value) => {
    this.setState({
      [item]: value,
      error: null,
    });
  };

  sendMessage = async () => {
    this.setState({working: true});
    const msg = {
      eventId: `${this.state.event.ema}|${this.state.event.dat}`,
      userRem: this.state.user.ema,
      ema: this.state.user.ema,
      nom: this.state.user.nom,
      pic: this.state.user.pic,
      tit: 'A todos os prestadores',
      msg: this.state.texto,
    };
    // Se chamado de um work: sou prestador conversando com organizador
    if (this.state.work) {
      msg.userDes = this.state.destId || this.state.event.ema;
      msg.tit = `Sobre: ${this.state.event.tit}`;
      const msgId = await chatCreate(msg);
      const data = {
        dst: this.state.destId || this.state.event.ema,
        tit: msg.tit,
        txt: this.state.texto,
        ema: this.state.event.ema,
        dat: this.state.event.dat,
        tsk: this.state.job,
        rem: this.state.user.ema,
        nom: this.state.user.nom,
        pic: this.state.user.pic,
        sta: 4,
        msgId: msgId,
      };
      createChatMessage(data);
      // Se chamado não é um work: sou organizador falando com prestador ou especialidade ou todos
    } else {
      let filter = r => true;
      if (this.state.userId) {
        msg.userDes = this.state.userId;
        msg.tit = `Para: ${
          this.state.usrs.find(s => s.key === this.state.userId).name
        }`;
        msg.pid = this.state.usrs.find(s => s.key === this.state.userId).pic;
        filter = r => r.emp === this.state.userId;
      } else if (this.state.jobId) {
        msg.jobId = this.state.jobId;
        msg.tit = `Para: ${this.state.jobId}`;
        filter = r => r.tsk === this.state.jobId;
      }
      const msgId = await chatCreate(msg);
      const queryParams = {
        ema: this.state.event.ema,
        dat: this.state.event.dat,
      };
      const query = encodeParam(queryParams);
      const res = await listWork(query);
      res.Items.filter(filter).map(async reg => {
        const data = {
          dst: reg.emp,
          tit: msg.tit,
          txt: this.state.texto,
          ema: this.state.user.ema,
          dat: this.state.event.dat,
          tsk: reg.skill,
          rem: this.state.user.ema,
          nom: this.state.user.nom,
          pic: this.state.user.pic,
          sta: 4,
          msgId: msgId,
        };
        await createChatMessage(data);
      });
    }
    this.state.refresh();
    this.setState({working: false});
    this.props.navigation.goBack();
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView style={{flex: 1}}>
            <View style={styles.listStyle}>
              {this.state.texto ? (
                <View style={styles.cmdBar}>
                  <Button
                    uppercase={false}
                    icon="email"
                    mode="contained"
                    color={Colors.mainColor}
                    disabled={this.state.working}
                    onPress={this.sendMessage}>
                    Enviar
                  </Button>
                </View>
              ) : null}

              <View style={styles.formContainer}>
                <TextInput
                  label="Mensagem"
                  multiline
                  mode="outlined"
                  value={this.state.texto}
                  onChangeText={text => this.changeValue('texto', text)}
                />
              </View>
              {!this.state.work && !this.state.userId && (
                <View style={styles.formContainer}>
                  <Text>Apenas para a especialidade (opcional)</Text>
                  <RNPickerSelect
                    onValueChange={itemValue =>
                      this.changeValue('jobId', itemValue)
                    }
                    useNativeAndroidPickerStyle={false}
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'Escolha uma das especialidades...',
                      value: null,
                      color: Colors.bluish,
                    }}
                    items={this.state.jobs.map(job => ({
                      label: job.name,
                      value: job.key,
                    }))}
                  />
                </View>
              )}
              {!this.state.work && !this.state.jobId && (
                <View style={styles.formContainer}>
                  <Text>Apenas para o prestador (opcional)</Text>
                  <RNPickerSelect
                    onValueChange={itemValue =>
                      this.changeValue('userId', itemValue)
                    }
                    useNativeAndroidPickerStyle={false}
                    style={pickerSelectStyles}
                    placeholder={{
                      label: 'Escolha um prestador...',
                      value: null,
                      color: Colors.bluish,
                    }}
                    items={this.state.usrs.map(usr => ({
                      label: usr.name,
                      value: usr.key,
                    }))}
                  />
                </View>
              )}
            </View>
          </ScrollView>
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
  listStyle: {
    backgroundColor: Colors.white,
    borderBottomColor: Colors.lightFG,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentContainer: {
    marginLeft: 2,
    marginRight: 2,
    marginTop: 2,
    marginBottom: 10,
    borderTopColor: 'silver',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  formContainer: {
    flexDirection: 'column',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  cmdBar: {
    flexDirection: 'column',
    padding: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    marginHorizontal: 12,
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 3,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 3,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(ChatMessage);
