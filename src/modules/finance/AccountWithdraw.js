/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, StyleSheet, Text, Alert, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import {NavigationEvents, NavigationActions} from 'react-navigation';
import {TextInput, Button} from 'react-native-paper';

import {connect} from 'react-redux';
import Colors from '~/config/Colors';
import {encodeParam} from '~/services/utils';

import {getBalance, withdraw, getTransfers} from '~/services/accountsApi';

import moment from 'moment';

const numbro = require('numbro');
let ptbr = require('numbro/dist/languages/pt-BR.min');
numbro.registerLanguage(ptbr, true);
numbro.setLanguage('pt-BR');

const formatVal = num => {
  return numbro(parseFloat(num)).format({
    thousandSeparated: true,
    mantissa: 2,
  });
};

class JobCard extends React.Component {
  render() {
    return (
      <View style={styles.container2}>
        {this.props.item.doc && this.props.item.doc.split('#').length > 3 && (
          <View>
            <View style={styles.lista}>
              <Text style={styles.textCorpo}>
                {`${moment(this.props.item.tms).format('DD/MM/YY HH:mm')} - ${
                  this.props.item.des
                }`}
              </Text>
            </View>
            <View style={styles.corpo}>
              <View style={styles.lista}>
                <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                  Valor
                </Text>
                <Text style={styles.textCorpo}>
                  {formatVal(this.props.item.val)}
                </Text>
              </View>
              <View style={styles.lista}>
                <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                  Banco
                </Text>
                <Text style={styles.textCorpo}>
                  {this.props.item.doc.split('#')[1]}
                </Text>
              </View>
              <View style={styles.lista}>
                <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                  Agência
                </Text>
                <Text style={styles.textCorpo}>
                  {this.props.item.doc.split('#')[2]}
                </Text>
              </View>
              <View style={styles.lista}>
                <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                  Conta
                </Text>
                <Text style={styles.textCorpo}>
                  {this.props.item.doc.split('#')[3]}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

class AccountWithdraw extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Transferência',
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
            onPress={() => navigation.dispatch(NavigationActions.back())}
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
      working: false,
      page: '',
      data: [],
      currentValue: '0,00',
      error: null,
      user: null,
      refreshing: true,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user}, () => {
      this.makeRemoteRequest();
    });
  }

  makeRemoteRequest = () => {
    const queryParams = {emp: this.props.auth.user.ema};
    if (this.state.loading) {
      const {start} = this.state;
      if (start) {
        queryParams.start = start;
      }
      // __DEV__ && console.tron.log(queryParams);
      const query = encodeParam(queryParams);
      getBalance(this.props.auth.user.ema)
        .then(bal => {
          getTransfers(query).then(res => {
            this.setState({
              data: !start ? res.Items : [...this.state.data, ...res.Items],
              last: res.LastEvaluatedKey,
              error: res.error || null,
              loading: false,
              bal,
              currentValue: formatVal(bal),
              refreshing: false,
            });
          });
        })
        .catch(error => {
          this.setState({error});
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

  getHour(dta) {
    return moment(dta).format('DD/MM/YYYY HH:mm');
  }

  async withdraw() {
    if (this.state.val > this.state.bal) {
      Alert.alert('Valor maior que saldo disponível');
      return;
    }
    if (this.state.val < 5) {
      Alert.alert('Valor deve ser maior que R$ 5,00');
      return;
    }
    this.setState({working: true});
    const ret = await withdraw(this.props.auth.user.ema, this.state.val);
    Alert.alert(ret.msg);
    this.setState({working: false, val: ''});
    if (ret.success) {
      this.makeRemoteRequest();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.handleRefresh} />
        <View style={styles.sub}>
          <View style={styles.header}>
            <View styte={styles.headItem}>
              <View style={styles.subHead}>
                <Text style={styles.headNumber}>
                  R$ {this.state.currentValue}
                </Text>
              </View>
              <View style={styles.subHead}>
                <Text style={styles.headText}>Saldo disponível</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.container2}>
          <TextInput
            label="Valor a transferir"
            value={this.state.val}
            style={{
              marginBottom: 32,
              backgroundColor: 'white',
              width: '65%',
            }}
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={text => this.setState({val: text})}
          />
          <Button
            compact
            uppercase={false}
            icon="check"
            mode="contained"
            color={Colors.secColor}
            disabled={!this.state.val || this.state.working}
            onPress={() => this.withdraw()}>
            Confirmar
          </Button>
          <View style={styles.headItem}>
            <Text style={styles.headText}>Histórico</Text>
          </View>
        </View>

        <View style={{flex: 1}}>
          {this.state.data && this.state.data.length > 0 ? (
            <FlatList
              removeClippedSubviews
              data={this.state.data}
              renderItem={({item}) => <JobCard item={item} />}
              keyExtractor={(item, i) => item.tms}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
            />
          ) : !this.state.loading ? (
            <View style={styles.emptyContainer}>
              <Text style={{color: Colors.tabIconSelected, fontSize: 16}}>
                Nenhum movimento
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
  sub: {
    height: 80,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  subHead: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headItem: {
    // flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  headText: {
    fontSize: 16,
    color: Colors.lightColor,
  },
  headNumber: {
    fontSize: 36,
    fontWeight: '400',
    color: Colors.bluish,
  },
  container2: {
    backgroundColor: Colors.white,
    margin: 0,
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  entry: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  corpo: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 8,
  },
  lista: {
    flex: 1,
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(AccountWithdraw);
