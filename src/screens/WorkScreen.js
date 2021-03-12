/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import {NavigationEvents, StackActions} from 'react-navigation';
import {Icon} from 'react-native-elements';

import Colors from '~/config/Colors';
import {listWork} from '~/services/worksApi';
import WorkCard from '~/components/WorkCard';
import {encodeParam} from '~/services/utils';

class WorkScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Trabalhos',
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
      listWork(query)
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

  renderFooter = () => {
    if (!this.state.loading) {
      return null;
    }

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: '#CED0CE',
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  viewJob = job => {
    this.props.navigation.navigate('EventOrgData', {
      ema: job.ema,
      dat: job.dat,
      tsk: job.tsk,
      val: job.val,
      pic: job.pic,
      wreg: job,
      vpre: job.aus || job.pre,
      work: true,
      ro: true,
      // onNavigateBack: this.handleRefresh,
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
        {this.state.data && this.state.data.length > 0 ? (
          <FlatList
            removeClippedSubviews
            data={this.state.data}
            renderItem={({item}) => (
              <WorkCard item={item} org onPress={() => this.viewJob(item)} />
            )}
            keyExtractor={(item, i) => `${item.eventId}.${item.skill}${i}`}
            ListFooterComponent={this.renderFooter}
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
  btnStyle: {
    backgroundColor: 'transparent',
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

export default connect(mapStateToProps)(WorkScreen);
