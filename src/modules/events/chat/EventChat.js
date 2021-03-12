/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, FlatList, Text, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {FAB} from 'react-native-paper';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Colors from '~/config/Colors';
import {Creators as regActions} from '~/redux/ducks/reg';
import {chatEvent} from '~/services/chatApi';
import {encodeParam} from '~/services/utils';
import ChatItem from '~/components/ChatItem';
// import {notify} from '~/services/notificaApi';

class EventChat extends React.Component {
  static navigationOptions = {
    title: 'Chats',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      data: [],
    };
  }

  componentDidMount() {
    const {event, work, job, ro, destId} = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({event, work, job, ro, destId}, () => {
      this.makeRemoteRequest();
    });
  }

  makeRemoteRequest = () => {
    const queryParams = {
      eventId: `${this.state.event.ema}|${this.state.event.dat}`,
    };

    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      chatEvent(query)
        .then(res => {
          let list;
          if (this.state.destId) {
            list = res.Items.filter(item => {
              return item.msgId.split('#')[3] === this.state.destId;
            });
          } else {
            list = res.Items;
          }
          this.setState({
            data: !start ? list : [...this.state.data, ...list],
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

  viewItem = item => {
    // Notificar o remetente que voltei para o chat (se nao for read-only)
    // if (!this.state.ro) {
    //   const tit = 'Nova postagem';
    //   const uId = item.msgId.split('#')[3];
    //   notify(
    //     uId,
    //     tit,
    //     '',
    //     `${this.props.auth.user.nom} entrou em um chat com você`,
    //   );
    // }
    this.props.navigation.navigate('ChatView', {
      msgId: item.msgId,
      ro: this.state.ro,
    });
  };

  newItem = () => {
    this.props.navigation.navigate('ChatMessage', {
      event: this.state.event,
      refresh: this.handleRefresh,
      work: this.state.work,
      job: this.state.job,
      destId: this.state.destId,
      chats: this.state.data,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleRefresh} />
        {this.state.data && this.state.data.length > 0 ? (
          <View style={styles.contentContainer}>
            <FlatList
              removeClippedSubviews
              data={this.state.data}
              renderItem={({item}) => (
                <ChatItem
                  item={item}
                  userId={this.props.auth.user.ema}
                  onPress={() => this.viewItem(item)}
                />
              )}
              keyExtractor={(item, i) => item.msgId + i}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
            />
            {!this.state.ro && (
              <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => this.newItem()}
              />
            )}
          </View>
        ) : !this.state.loading ? (
          <View style={styles.emptyContainer}>
            <Text style={{color: Colors.tabIconSelected, fontSize: 16}}>
              Nenhum chat registrado
            </Text>
            {!this.state.ro && (
              <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => this.newItem()}
              />
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{color: Colors.tabIconDefault, fontSize: 16}}>
              Procurando...
            </Text>
          </View>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center'
  },
  headText: {
    fontSize: 24,
    color: Colors.mainColor,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 20,
    bottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
)(EventChat);
