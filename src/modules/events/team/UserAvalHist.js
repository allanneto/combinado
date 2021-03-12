/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, ActivityIndicator, FlatList} from 'react-native';

import {ListItem, Rating} from 'react-native-elements';
import {Text} from 'react-native-paper';
import {NavigationEvents} from 'react-navigation';

import {workHistory} from '~/services/worksApi';
import {getImageUrl} from '~/services/s3Api';
import Colors from '~/config/Colors';

import {Creators as searchActions} from '~/redux/ducks/search';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {encodeParam} from '~/services/utils';

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
        bottomDivider
        subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
        title={this.props.item.tit}
        subtitle={`${moment(this.props.item.fim).format('DD/MM/YYYY')} - ${
          this.props.item.tsk
        }`}
        onPress={this.props.onPress}
        chevron
        rightElement={
          this.props.item.avl ? (
            <Rating
              readonly
              startingValue={this.props.item.avl || 0}
              imageSize={16}
            />
          ) : this.props.item.aus ? (
            <Text
              style={{
                padding: 4,
                color: Colors.white,
                backgroundColor: Colors.errorBackground,
              }}>
              Ausente
            </Text>
          ) : null
        }
      />
    );
  }
}

class UserAvalHist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      ema: null,
      refreshing: false,
    };
  }

  static navigationOptions = {
    title: 'Histórico',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {ema} = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ema: ema}, () => {
      this.makeRemoteRequest();
    });
  }

  makeRemoteRequest = () => {
    const queryParams = {ema: this.state.ema};
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      workHistory(query)
        .then(res => {
          this.setState({
            data: !start ? res : [...this.state.data, ...res],
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

  renderFooter = () => {
    if (!this.state.loading) {
      return null;
    }
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: Colors.lightBG,
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  avalUser = item => {
    this.props.navigation.navigate('UserAval', {
      item: item,
      ro: true,
      onNavigateBack: this.makeRemoteRequest,
    });
  };

  render() {
    if (this.state.ema) {
      return (
        <View style={styles.container}>
          <NavigationEvents onDidFocus={this.handleRefresh} />
          <FlatList
            removeClippedSubviews
            data={this.state.data}
            renderItem={({item}) => (
              <UserItem item={item} onPress={() => this.avalUser(item)} />
            )}
            keyExtractor={(item, i) => `${item.eventId}.${item.skill}${i}`}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.actContainer}>
          <Text style={{color: Colors.mainColor, marginLeft: 4}}>
            aguarde...
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  header: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(searchActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserAvalHist);
