/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import amplifyConfig from '~/config/amplifyConfig';
import {Icon} from 'react-native-elements';
import {getEvent, eventCanChat} from '~/services/eventsApi';

import Colors from '~/config/Colors';
import {Creators as regActions} from '~/redux/ducks/reg';
import {chatList} from '~/services/chatApi';
import {readUser} from '~/services/usersApi';
import {encodeParam} from '~/services/utils';
const v4 = require('uuid');

const Sockette = require('sockette');

require('moment/locale/pt-br.js');

class ChatView extends React.Component {
  static navigationOptions = {
    title: 'Chat',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      messages: [],
    };
  }

  async componentDidMount() {
    let {msgId, ro, notification} = this.props.navigation.state.params;
    if (notification) {
      const event = await getEvent(notification.ema, notification.dat);
      ro = !eventCanChat(event);
    }
    let tit = '???';
    const ps = msgId.split('#');
    if (ps[2] === 'A') {
      tit = 'A todos os prestadores';
    } else if (ps[2] === 'J') {
      tit = `Para: ${ps[3]}`;
    } else if (ps[2] === 'U') {
      const userId = ps[3];
      const user = await readUser(userId);
      tit = `Para: ${user.nom}`;
    }
    this.data = {
      action: 'sendMessage',
      msgId,
      userId: this.props.auth.user.ema,
      ema: this.props.auth.user.ema,
      nom: this.props.auth.user.nom,
      pic: this.props.auth.user.pic,
      tit,
    };
    this.ws = new Sockette(amplifyConfig.webSocket, {
      timeout: 10000,
      maxAttempts: 20,
      onopen: e => this.wsOpened(e),
      onmessage: e => this.wsReceived(e),
      onreconnect: e => this.wsConsole('Reconnecting...', e),
      onmaximum: e => this.wsConsole('Stop Attempting!', e),
      onclose: e => this.wsConsole('Closed!', e),
      onerror: e => this.wsConsole('Error:', e),
    });
    const queryParams = {
      msgId: msgId,
    };
    const query = encodeParam(queryParams);
    chatList(query)
      .then(res => {
        this.setState({
          loaded: true,
          ro,
          messages: res.Items.map((itm, i) => ({
            _id: i,
            text: itm.msg,
            createdAt: new Date(itm.sel.split('#')[1]),
            user: {
              _id: itm.sel.split('#')[2],
              name: itm.nom,
              avatar: itm.pic,
            },
          })),
          error: res.error || null,
        });
      })
      .catch(error => {
        this.setState({error, loading: false});
      });
  }

  componentWillUnmount() {
    this.ws.close();
  }

  wsConsole = (msg, e) => {
    if (__DEV__) {
      console.tron.log(msg, e);
    } else {
      console.log(msg, e);
    }
  };

  wsOpened = e => {
    if (__DEV__) {
      console.tron.log('Connected!', e);
    }
    this.ws.json(this.data);
  };

  wsReceived = e => {
    const itm = JSON.parse(e.data);
    if (itm.userId === this.props.auth.user.ema) {
      return;
    }
    if (__DEV__) {
      console.tron.log('Received!', itm);
    }
    const msg = {
      _id: v4(),
      text: itm.msg,
      createdAt: new Date(),
      user: {
        _id: itm.ema,
        name: itm.nom,
        avatar: itm.pic,
      },
    };
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  };

  onSend(messages = []) {
    // eslint-disable-next-line no-unused-vars
    for (const msg of messages) {
      const data = {...this.data, msg: msg.text};
      this.ws.json(data);
    }
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: Colors.white,
          },
          right: {
            backgroundColor: Colors.bluish,
          },
        }}
      />
    );
  };

  renderSend = props => {
    return (
      <Send {...props}>
        <View style={{marginLeft: 8, marginRight: 8, marginBottom: 12}}>
          <Icon name="send" type="material" color={Colors.lightBlue} />
        </View>
      </Send>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          renderUsernameOnMessage
          locale={'pt-br'}
          placeholder={
            !this.state.ro ? 'Tecle uma mensagem...' : 'Chat encerrado'
          }
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          textInputProps={{editable: !this.state.ro}}
          user={{
            _id: this.props.auth.user.ema,
            name: this.props.auth.user.nom,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center'
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(regActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChatView);
