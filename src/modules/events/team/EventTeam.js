/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  Keyboard,
  Image,
  Animated,
  Alert,
} from 'react-native';

import {ListItem} from 'react-native-elements';
import {Text, FAB} from 'react-native-paper';
import Dialog from 'react-native-dialog';
import {encodeParam} from '~/services/utils';

import {updateEvent, isEventBlocked} from '~/services/eventsApi';

import {updateJob, deleteJob} from '~/services/jobsApi';
import {listWork} from '~/services/worksApi';

import {getImageUrl} from '~/services/s3Api';
import Colors from '~/config/Colors';
import {userModel} from '~/config/models';

import {Creators as searchActions} from '~/redux/ducks/search';
import {bindActionCreators} from 'redux';
// import {readUser} from '~/services/usersApi';
// import {createNotification} from '~/services/notificaApi';

// import moment from 'moment';

const TaskItem = ({qpr, cod, qtd, val, pic}) => {
  return (
    <View style={styles.card}>
      {pic ? (
        <Image source={{uri: pic}} style={styles.icon} resizeMode="contain" />
      ) : (
        <Image style={styles.icon} resizeMode="contain" />
      )}
      <Text style={[styles.line, {width: '40%'}]}>{cod}</Text>
      <Text style={[styles.line, {width: '10%'}]}>
        {qpr}/{qtd}
      </Text>
      <Text style={[styles.line, {width: '20%'}]}>
        {parseFloat(val)
          .toFixed(2)
          .toLocaleString()}
      </Text>
    </View>
  );
};

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
        chevron
        subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
        leftAvatar={{
          rounded: true,
          source: {uri: this.props.item.pip},
        }}
        title={this.props.item.nop}
        subtitle={this.props.item.emp}
        onPress={this.props.onPress}
      />
    );
  }
}

class EventTeam extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      user: null,
      event: null,
      skill: null,
      error: null,
      qpr: 0,
      refreshing: false,
    };
  }

  componentDidMount() {
    const {
      event,
      skill,
      qpr,
      qtd,
      val,
      pic,
      ro,
      onChange,
      setActivate,
      setValue,
    } = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState(
      {
        user: this.props.auth.user,
        ro,
        onChange,
        setValue,
        setActivate,
        event: event,
        skill: skill,
        val,
        qpr,
        qtd,
        pic,
        dialogVisible: false,
        modalIsVisible: false,
        dialogVisible2: false,
        modalIsVisible2: false,
        addQtd: 0,
        subQtd: 0,
        modalAnimatedValue: new Animated.Value(0),
        skill_name: skill, //userModel.skl.find(s => s.key === skill).text.toLowerCase(),
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  }

  static navigationOptions = {
    title: 'Equipe',
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
      tsk: this.state.skill,
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
          });
        }
      })
      .catch(error => {
        this.setState({error, refreshing: false, loading: false});
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

  viewUser = item => {
    this.props.navigation.navigate('UserData', {
      ema: item.emp,
      user_incl: true,
      event: this.state.event,
      emp: item.emp,
      ro: this.state.ro || isEventBlocked(this.state.event),
      onNavigateBack: this.onRefresh,
      skill: this.state.skill,
      val: this.state.val,
    });
  };

  hab = (lst, k) => {
    const reg = userModel[lst].find(ele => ele.key === k);
    if (reg) {
      return reg.text;
    } else {
      return '???';
    }
  };

  searchUsers = () => {
    this.props.resetUserSearch();
    this.props.addUserSearch({
      attr: 'skl',
      opr: 'contains',
      val: this.state.skill,
    });
    this.props.navigation.navigate('UsersScreen', {
      event: this.state.event,
      skill_name: this.state.skill,
      skill: this.state.skill,
      val: this.state.val,
      nav: this.props.navigation.state.key,
      onNavigateBack: this.onRefresh,
    });
  };

  removeTask = () => {
    Alert.alert('Confirme a exclusão', 'A vaga será excluida', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        style: 'destructive',
        onPress: async () => {
          this.delTask(this.state.skill);
        },
      },
    ]);
  };

  delTask = async key => {
    this.setState({loading: true});
    const lst = this.state.event.tsk.filter(e => e.key !== key);
    const event = {
      ema: this.state.event.ema,
      dat: this.state.event.dat,
      tsk: lst,
    };
    try {
      if (this.state.event.sta !== 0) {
        await deleteJob(this.state.event.ema, this.state.event.dat, key);
      }
      await updateEvent(event);
      this.setState({loading: false, error: null});
      this.state.setValue(lst);
      this.state.onChange('tsk', lst);
      this.props.navigation.state.params.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({
        loading: false,
        error: 'Erro de gravação ' + err.message,
      });
    }
  };

  // warnRemove = async skill => {
  //   const queryParams = {
  //     ema: this.state.event.ema,
  //     dat: this.state.event.dat,
  //     tsk: skill,
  //   };
  //   const query = encodeParam(queryParams);
  //   const team = await listWork(query);
  //   for (const mbr of team) {
  //     this.notifyUserTeamRemove(this.state.event, mbr.emp, skill);
  //   }
  // };

  // notifyUserTeamRemove = (event, email, skill) => {
  //   readUser(email).then(user => {
  //     const when = moment(event.ini).format('DD/MM/YYYY HH:mm');
  //     const vaga = skill;
  //     const msgs = `Você foi retirado da vaga de ${vaga} no evento em ${when}`;
  //     createNotification(user, userId, event, skill, msgs, 2);
  //   });
  // };

  validActions = () => {
    const actions = [];
    const pos = this.state.event.tsk.find(ele => ele.key === this.state.skill);
    if (this.state.event.sta !== 0 && pos.qtd > this.state.qpr) {
      actions.push({
        icon: 'star',
        label: 'Convidar prestadores',
        onPress: () => this.searchUsers(),
      });
    }
    actions.push({
      icon: 'plus',
      label: 'Adicionar vagas',
      onPress: () => this.showDialog(),
    });
    if (this.state.qtd - this.state.qpr > 1) {
      actions.push({
        icon: 'close',
        label: 'Retirar vagas',
        onPress: () => this.showDialog2(),
      });
    }
    actions.push({
      icon: 'delete',
      label: 'Excluir a especialidade',
      onPress: () => this.removeTask(),
    });
    return actions;
  };

  showDialog = item => {
    this.setState({dialogVisible: true});
  };

  handleCancel = () => {
    this.setState({dialogVisible: false});
  };

  closeDemand = () => {
    try {
      Keyboard.dismiss();
      const qtd = this.state.addQtd;
      if (isNaN(qtd) || qtd === 0 || qtd > 10) {
        Alert.alert('Aviso', 'Informar um numero entre 1 e 10');
        return;
      }
      this.setState({dialogVisible: false, addQtd: 0});
      this.addPlaces();
      this.handleRefresh();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  showDialog2 = item => {
    this.setState({dialogVisible2: true});
  };

  handleCancel2 = () => {
    this.setState({dialogVisible2: false});
  };

  closeDemand2 = () => {
    try {
      Keyboard.dismiss();
      const qtd = this.state.subQtd;
      let max = this.state.qtd - this.state.qpr;
      if (max === this.state.qtd) {
        max -= 1;
      }
      if (isNaN(qtd) || qtd === 0 || qtd > max) {
        Alert.alert('Aviso', `Informar um numero entre 1 e ${max}`);
        return;
      }
      this.setState({dialogVisible2: false, subQtd: 0});
      this.subPlaces();
      this.handleRefresh();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  addPlaces = () => {
    const qtd = this.state.addQtd;
    const ant = this.state.event.tsk;
    const item = ant.find(e => e.key === this.state.skill);
    const tsk = ant.filter(e => e.key !== this.state.skill);
    if (item) {
      item.qtd += parseInt(qtd, 10);
      tsk.push(item);
      this.setState({event: {...this.state.event, tsk}, qtd: item.qtd}, () =>
        updateEvent(this.state.event),
      );
      this.state.onChange('tsk', tsk);
      this.state.setValue(tsk);
      this.props.navigation.state.params.onNavigateBack();
      // Se ja publicado: alterar jobs
      if (this.state.event.sta > 0) {
        const job = {
          ema: this.state.event.ema,
          dat: this.state.event.dat,
          skl: this.state.skill,
          qtd: item.qtd,
        };
        updateJob(job); //.then(() => this.state.setActivate(false));
      }
    }
  };

  subPlaces = () => {
    const qtd = this.state.subQtd;
    const ant = this.state.event.tsk;
    const item = ant.find(e => e.key === this.state.skill);
    const tsk = ant.filter(e => e.key !== this.state.skill);
    if (item) {
      item.qtd -= parseInt(qtd, 10);
      tsk.push(item);
      this.setState({event: {...this.state.event, tsk}, qtd: item.qtd}, () =>
        updateEvent(this.state.event),
      );
      this.state.onChange('tsk', tsk);
      this.state.setValue(tsk);
      this.props.navigation.state.params.onNavigateBack();
      // Se ja publicado: alterar jobs
      if (this.state.event.sta > 0) {
        const job = {
          ema: this.state.event.ema,
          dat: this.state.event.dat,
          skl: this.state.skill,
          qtd: item.qtd,
        };
        updateJob(job);
      }
    }
  };

  render() {
    if (this.state.event) {
      return (
        <View style={styles.container}>
          <View>
            <Dialog.Container visible={this.state.dialogVisible}>
              <Dialog.Title>Adicionar vagas</Dialog.Title>
              <Dialog.Description>
                Quantas vagas deseja adicionar?
              </Dialog.Description>
              <Dialog.Input
                placeholder="Quantidade"
                keyboardType="numeric"
                onChangeText={addQtd => this.setState({addQtd})}
              />
              <Dialog.Button label="Cancelar" onPress={this.handleCancel} />
              <Dialog.Button label="Confirmar" onPress={this.closeDemand} />
            </Dialog.Container>
            <Dialog.Container visible={this.state.dialogVisible2}>
              <Dialog.Title>Retirar vagas</Dialog.Title>
              <Dialog.Description>
                Quantas vagas deseja retirar?
              </Dialog.Description>
              <Dialog.Input
                placeholder="Quantidade"
                keyboardType="numeric"
                onChangeText={subQtd => this.setState({subQtd})}
              />
              <Dialog.Button label="Cancelar" onPress={this.handleCancel2} />
              <Dialog.Button label="Confirmar" onPress={this.closeDemand2} />
            </Dialog.Container>
          </View>

          <TaskItem
            cod={this.state.skill}
            qtd={this.state.qtd}
            val={this.state.val}
            qpr={this.state.qpr}
            pic={this.state.pic || ''}
          />
          <FlatList
            removeClippedSubviews
            data={this.state.data}
            renderItem={({item}) => (
              <UserItem item={item} onPress={() => this.viewUser(item)} />
            )}
            keyExtractor={item => item.emp}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
          />
          {!isEventBlocked(this.state.event) && (
            <FAB.Group
              open={this.state.open}
              icon={this.state.open ? 'chevron-down' : 'chevron-up'}
              actions={this.validActions()}
              onStateChange={({open}) => this.setState({open})}
            />
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
  listStyle: {
    backgroundColor: Colors.white,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    padding: 6,
    borderColor: Colors.tabIconSelected,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: Colors.tabBar,
  },
  line: {
    fontSize: 14,
    width: '22%',
    color: Colors.mainColor,
  },
  icon: {
    backgroundColor: 'transparent',
    // borderRadius: 18,
    height: 40,
    width: '10%',
    alignItems: 'center',
    justifyContent: 'space-between',
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
)(EventTeam);
