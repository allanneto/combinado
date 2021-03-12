/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {SearchBar, Icon} from 'react-native-elements';
import {NavigationEvents, StackActions} from 'react-navigation';

import {connect} from 'react-redux';
import Colors from '../config/Colors';

import {listNotifica} from '~/services/notificaApi';
import MessageCard from '~/components/MessageCard';
import {encodeParam} from '~/services/utils';

import moment from 'moment';

class NotificationsScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Notificações',
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
      page: '',
      data: [],
      error: null,
      user: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user}, () => {
      this.makeRemoteRequest();
    });
  }

  makeRemoteRequest = () => {
    const queryParams = {};
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      listNotifica(query)
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

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  viewNotification = item => {
    if (item.msgId) {
      this.props.navigation.navigate('ChatView', {
        msgId: item.msgId,
      });
    } else {
      this.props.navigation.navigate('NotificationData', {
        notification: item,
        onNavigateBack: this.makeRemoteRequest,
      });
    }
  };

  getHour(dta) {
    return moment(dta).format('DD/MM/YYYY HH:mm');
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleRefresh} />
        <View style={{flex: 1}}>
          {this.state.data && this.state.data.length > 0 ? (
            <FlatList
              removeClippedSubviews
              data={this.state.data}
              renderItem={({item}) => (
                <MessageCard
                  item={item}
                  onPress={() => this.viewNotification(item)}
                />
              )}
              keyExtractor={(item, i) => item.dst + item.dat + i}
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
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(NotificationsScreen);
