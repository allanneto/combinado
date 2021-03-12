/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
  Clipboard,
} from 'react-native';

import {ListItem, Rating, Icon} from 'react-native-elements';
import {Text, Button} from 'react-native-paper';

import {closeEvent} from '~/services/eventsApi';
import {getImageUrl} from '~/services/s3Api';
import Colors from '~/config/Colors';
import {listWork} from '~/services/worksApi';
import {encodeParam} from '~/services/utils';

import {Creators as searchActions} from '~/redux/ducks/search';
import {bindActionCreators} from 'redux';

const numbro = require('numbro');
let ptbr = require('numbro/dist/languages/pt-BR.min');
numbro.registerLanguage(ptbr, true);
numbro.setLanguage('pt-BR');

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
        leftAvatar={{
          source: {uri: this.props.item.pip},
          rounded: true,
        }}
        title={this.props.item.nop}
        subtitle={this.props.item.tsk}
        onPress={!this.props.ro ? this.props.onPress : () => null}
        chevron={!this.props.item.avl && !this.props.ro}
        rightElement={
          this.props.item.avl ? (
            <Rating
              readonly
              startingValue={this.props.item.avl || 0}
              imageSize={16}
            />
          ) : this.props.item.pre ? (
            <Text
              style={{
                padding: 4,
                color: Colors.white,
                backgroundColor: Colors.bluish,
              }}>
              Presente
            </Text>
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

class EventClose extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      user: null,
      event: null,
      skill: null,
      error: null,
      qpr: 0,
      qok: 0,
      refreshing: false,
    };
  }

  componentDidMount() {
    const {
      event,
      ro,
      nav,
      onNavigateBack,
      onChange,
    } = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        user: this.props.auth.user,
        onNavigateBack,
        onChange,
        event: event,
        nav: nav,
        ro,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  }

  static navigationOptions = {
    title: 'Encerramento',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  makeRemoteRequest = () => {
    this.setState({loading: true});
    const queryParams = {
      ema: this.state.event.ema,
      dat: this.state.event.dat,
    };
    const query = encodeParam(queryParams);

    listWork(query)
      .then(res => {
        if (this.state.loading) {
          this.setState({
            data: res.Items,
            error: res.error || null,
            loading: false,
            refreshing: false,
            qpr: res.Items.length,
            qok: res.Items.filter(r => r.pre || r.aus).length,
            qav: res.Items.filter(r => !r.avl && r.pre).length,
          });
        }
      })
      .catch(error => {
        this.setState({error, loading: false});
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  onRefresh = () => {
    this.handleRefresh();
    this.props.navigation.state.params.onNavigateBack();
  };

  canClose = () => {
    const can = this.state.qpr === 0 || this.state.qok === this.state.qpr;
    return can;
  };

  canAval = () => {
    const can = this.state.qpr > 0 && this.state.qav > 0;
    return can;
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
      onNavigateBack: this.makeRemoteRequest,
    });
  };

  avalGroup = item => {
    this.props.navigation.navigate('UserGroupAval', {
      onNavigateBack: this.makeRemoteRequest,
      event: this.state.event,
    });
  };

  closeEvent = () => {
    Alert.alert('Confirme o encerramento', 'O evento será encerrado', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.setEventClose();
        },
      },
    ]);
  };

  setEventClose = async () => {
    this.setState({working: true});
    try {
      const {stp, msg} = await closeEvent(this.state.event);
      this.setState({working: false});
      if (stp === 2) {
        Alert.alert('EVENTO NÃO ENCERRADO', msg);
        this.state.onChange('msg', msg);
        this.props.navigation.goBack();
      } else {
        this.props.navigation.state.params.onNavigateBack();
        this.props.navigation.goBack(this.state.nav);
      }
    } catch (err) {
      if (err.message.contains('504')) {
        Alert.alert(
          'Erro',
          'Tempo excedido. Por favor, tente novamente em alguns instantes',
        );
      } else {
        Alert.alert('Erro', err.message);
      }
    }
  };

  totValor = () => {
    const tsk = this.state.event.tsk || [];
    const tot = tsk.reduce((p, r) => p + r.val * r.qtd, 0);
    return numbro(parseFloat(tot)).format({
      thousandSeparated: true,
      mantissa: 2,
    });
  };

  totPagar = () => {
    const tsk = this.state.data.filter(t => t.pre) || [];
    const tot = tsk.reduce((p, r) => p + r.val, 0);
    return numbro(parseFloat(tot)).format({
      thousandSeparated: true,
      mantissa: 2,
    });
  };

  copyClip = () => {
    Clipboard.setString(this.state.event.dig);
    Alert.alert('Copiado', 'Valor da linha digitável foi copiado');
  };

  render() {
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.sub}>
            <View style={styles.header}>
              <View styte={styles.headItem}>
                <View style={styles.subHead}>
                  <Text style={styles.headText}>Valor previsto</Text>
                </View>
                <View style={styles.subHead}>
                  <Text style={styles.headNumber}>{this.totValor()}</Text>
                </View>
              </View>

              <View styte={styles.headItem}>
                <View style={styles.subHead}>
                  <Text style={styles.headText}>Valor a pagar</Text>
                </View>
                <View style={styles.subHead}>
                  <Text style={styles.headNumber}>{this.totPagar()}</Text>
                </View>
              </View>
            </View>
          </View>
          {this.state.event.dig && (
            <ListItem
              leftIcon={{
                name: 'barcode-scan',
                type: 'material-community',
                color: Colors.mainColor,
              }}
              rightIcon={{
                name: 'content-copy',
                type: 'material-community',
                color: Colors.mainColor,
                onPress: () => this.copyClip(),
              }}
              title="Linha digitável do boleto"
              bottomDivider
              subtitleStyle={{
                color: Colors.bluish,
                fontSize: 12,
                fontWeight: 'bold',
              }}
              subtitle={this.state.event.dig}
            />
          )}

          {this.state.data.length > 0 ? (
            <FlatList
              removeClippedSubviews
              data={this.state.data}
              renderItem={({item}) => (
                <UserItem
                  item={item}
                  ro={this.state.ro}
                  onPress={() => this.avalUser(item)}
                />
              )}
              keyExtractor={item => item.emp}
              ListFooterComponent={this.renderFooter}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon
                name="cloud-question"
                type="material-community"
                color={Colors.tabIconDefault}
                size={36}
                iconStyle={{marginBottom: 4}}
              />
              <Text style={{color: Colors.tabIconSelected, fontSize: 16}}>
                Nenhum prestador no evento
              </Text>
            </View>
          )}
          {!this.state.ro && (
            <View style={styles.cmdBar}>
              {this.canAval() ? (
                <Button
                  compact
                  uppercase={false}
                  icon="star"
                  mode="contained"
                  disabled={this.state.working}
                  color={Colors.secColor}
                  onPress={this.avalGroup}>
                  Avaliar em grupo
                </Button>
              ) : null}
              {this.canClose() ? (
                <Button
                  compact
                  uppercase={false}
                  icon="close"
                  mode="contained"
                  color={Colors.mainColor}
                  disabled={this.state.working}
                  onPress={this.closeEvent}>
                  Encerrar o evento
                </Button>
              ) : null}
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.actContainer}>
          <ActivityIndicator size="small" color={Colors.mainColor} />
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
  sub: {
    height: 80,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 30,
    fontWeight: '400',
    color: Colors.bluish,
  },

  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
)(EventClose);
