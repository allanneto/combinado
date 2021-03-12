/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, Alert} from 'react-native';
import {ListItem, SearchBar, Rating, Icon} from 'react-native-elements';
import {
  NavigationEvents,
  NavigationActions,
  StackActions,
} from 'react-navigation';
import {FAB} from 'react-native-paper';
import {connect} from 'react-redux';

import {getImageUrl} from '../services/s3Api';
import Colors from '../config/Colors';
import {queryUsers} from '../services/usersApi';
import {encodeParam} from '~/services/utils';

class UserItem extends Component {
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
        title={this.props.item.nom}
        subtitle={
          this.props.item.avl ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Rating
                readonly
                showRating={false}
                startingValue={this.props.item.avl || 0}
                imageSize={14}
              />
              <Text style={{marginLeft: 8, fontWeight: 'bold'}}>
                {this.props.item.avl} ({this.props.item.qav}{' '}
                {this.props.item.qav > 1 ? 'avaliações' : 'avaliação'})
              </Text>
            </View>
          ) : (
            'Nenhuma avaliação'
          )
        }
        bottomDivider
        chevron
        subtitleStyle={{
          color: Colors.mainColor,
        }}
        leftAvatar={
          this.state.image
            ? {
                rounded: true,
                source: {uri: this.state.image},
              }
            : {
                rounded: true,
                icon: {name: 'user', type: 'font-awesome'},
              }
        }
        onPress={this.props.onPress}
      />
    );
  }
}

class UsersScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Prestadores',
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
            onPress={() =>
              navigation.state.routeName === 'Home'
                ? navigation.dispatch(StackActions.popToTop())
                : navigation.dispatch(NavigationActions.back())
            }
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
    const {params} = this.props.navigation.state;
    this.state = {
      loading: false,
      data: [],
      page: '',
      error: null,
      refreshing: false,
      nav: this.props.navigation.state.key,
      event: params ? params.event : null,
      skill_name: params ? params.skill_name : null,
      skill: params ? params.skill : null,
      val: params ? params.val : null,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({search: this.searchUsers});
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ok: false});
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const queryParams = {};
    const filter = this.props.search.user;
    const skills = [];
    // eslint-disable-next-line no-unused-vars
    for (const item of filter) {
      if (item.attr === 'reg') {
        queryParams.reg = item.val;
      } else if (item.attr === 'nom') {
        queryParams.nom = item.val;
      } else if (item.attr === 'skl') {
        skills.push(item.val);
      }
    }
    if (skills.length > 0) {
      queryParams.jobs = skills;
    }
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      const query = encodeParam(queryParams);
      queryUsers(query)
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

  viewUser = id => {
    if (this.props.auth.user) {
      this.props.navigation.navigate('UserData', {
        ema: id,
        event: this.state.event,
        skill: this.state.skill,
        val: this.state.val,
        nav: this.state.nav,
        onNavigateBack: this.props.navigation.state.params.onNavigateBack,
      });
    } else {
      Alert.alert('Conecte-se para acessar');
    }
  };

  searchUsers = () => {
    this.props.navigation.navigate('TeamSearch', {
      onNavigateBack: this.handleRefresh,
    });
  };

  formatLocal = () => {
    if (
      this.props.search.user.find(ele => ele.attr === 'reg') &&
      this.props.reg &&
      this.props.reg.reg
    ) {
      const p = this.props.reg.reg.split('#');
      return `Cadastrados em ${p[2]}/${p[1]}`;
    }
    return 'Cadastrado geral';
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
              <UserItem item={item} onPress={() => this.viewUser(item.ema)} />
            )}
            keyExtractor={(item, i) => item.ema + i}
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
            <Text style={{color: Colors.tabIconDefault, fontSize: 14}}>
              Modifique os critérios de consulta ou tente mais tarde
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{color: Colors.tabIconDefault, fontSize: 16}}>
              Procurando...
            </Text>
          </View>
        )}
        {this.props.auth.user && (
          <FAB
            style={styles.fab}
            icon="magnify"
            onPress={() => this.searchUsers()}
          />
        )}
      </View>
    );
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
  contentContainer: {
    paddingTop: 30,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 24,
    bottom: 24,
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

export default connect(mapStateToProps)(UsersScreen);
