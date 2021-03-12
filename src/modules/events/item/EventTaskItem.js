/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Keyboard, Alert} from 'react-native';

import {TextInput, Button, Text} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import {updateEvent, listSkills} from '~/services/eventsApi';
import {insertJob} from '~/services/jobsApi';
import Colors from '~/config/Colors';

class EventTaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = {
    title: 'Nova vaga',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {
      event,
      onChange,
      onValue,
      ro,
      setActivate,
    } = this.props.navigation.state.params;
    let skills;
    listSkills().then(rec => {
      skills = rec.map(skl => ({
        label: skl.key,
        value: skl.key,
        pic: skl.pic,
      }));
      skills = skills.filter(
        item => item.value && !this.hasValue(item.value, event.tsk || []),
      );
      this.setState({
        event,
        key: null,
        qtd: null,
        val: null,
        pic: null,
        skills,
        onChange,
        onValue,
        ro,
        setActivate,
        loaded: true,
        error: null,
      });
    });
  }

  getPic = key => {
    const lin = this.state.skills.find(item => item.value === key);
    return lin.pic;
  };

  changeValue = (key, value) => {
    this.setState({
      [key]: value,
      error: null,
    });
  };

  setChoice = key => {
    this.setState({
      key,
      pic: this.getPic(key),
      error: null,
    });
  };

  hasValue = (key, lst) => {
    const test = lst.filter(item => item.key === key).length;
    return test > 0;
  };

  saveValue = async () => {
    Keyboard.dismiss();
    if (!this.state.key || !this.state.qtd || !this.state.val) {
      this.setState({error: 'Preenchimento incompleto'});
      return;
    }
    const item = {
      key: this.state.key,
      qtd: parseInt(this.state.qtd, 10),
      qpr: 0,
      val: parseFloat(this.state.val),
      pic: this.state.pic,
    };
    let lst = this.state.event.tsk || [];
    const has = this.hasValue(this.state.key, lst);
    if (!has) {
      lst.push(item);
    } else {
      lst = lst.filter(e => e.key !== this.state.key);
      lst.push(item);
    }
    this.setState({loading: true});
    const event = {
      ema: this.state.event.ema,
      dat: this.state.event.dat,
      tsk: lst,
    };
    try {
      await updateEvent(event);
      if (this.state.event.sta !== 0) {
        const job = {
          ema: this.state.event.ema,
          dat: this.state.event.dat,
          tsk: this.state.key,
          qtd: parseInt(this.state.qtd, 10),
          val: parseInt(this.state.val, 10),
          nom: this.state.event.nom,
          ini: this.state.event.ini,
          fim: this.state.event.fim,
          tit: this.state.event.tit,
          cel: this.state.event.cel,
          loc: this.state.event.loc,
          geo: this.state.event.geo,
          reg: this.state.event.reg,
          pic: this.state.pic,
        };
        await insertJob(job);
        this.state.setActivate(false);
      }
      this.setState({loading: false, error: null});
      this.state.onValue(lst);
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

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <Text>Serviço</Text>
            <RNPickerSelect
              placeholder={{
                label: 'Selecione um tipo',
                value: null,
              }}
              items={this.state.skills}
              onValueChange={value => {
                this.setState({
                  key: value,
                  pic: this.getPic(value),
                });
              }}
              style={styles}
              value={this.state.key}
            />
          </View>
          <View style={styles.form}>
            <View style={styles.line}>
              <TextInput
                label="Quantidade"
                value={this.state.qtd}
                keyboardType="numeric"
                style={{
                  marginBottom: 8,
                  backgroundColor: 'white',
                  width: '30%',
                }}
                returnKeyType="done"
                onChangeText={text => this.changeValue('qtd', text)}
              />
              <TextInput
                label="Valor"
                value={this.state.val}
                style={{
                  marginBottom: 8,
                  backgroundColor: 'white',
                  width: '65%',
                }}
                keyboardType="numeric"
                returnKeyType="done"
                onChangeText={text => this.changeValue('val', text)}
              />
            </View>
            <View style={styles.cmdContainer}>
              <Button
                mode="contained"
                icon="check"
                loading={this.state.loading}
                onPress={() => this.saveValue()}>
                Salvar
              </Button>
            </View>
          </View>
          {/* </ScrollView> */}
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
    backgroundColor: Colors.white,
  },
  list: {
    height: 240,
  },
  form: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopColor: Colors.tabIconDefault,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  line: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  cmdContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'flex-start',
    paddingBottom: 10,
  },
  inputContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.tabBar,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(EventTaskItem);
