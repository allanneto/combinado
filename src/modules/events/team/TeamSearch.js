/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';

import {Badge} from 'react-native-elements';
import {Button, Text, TextInput, Switch} from 'react-native-paper';

import Colors from '~/config/Colors';
import {listSkills} from '~/services/eventsApi';

import {Creators as searchActions} from '~/redux/ducks/search';
import {bindActionCreators} from 'redux';

class FeatBadge extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: false,
    };
  }

  componentDidMount() {
    const {selected, title, feat, value} = this.props;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      selected,
      title,
      feat,
      value,
    });
  }

  selectFilter = filter => {
    filter(this.state.selected, this.state.feat, this.state.value);
    this.setState(prev => {
      return {selected: !prev.selected};
    });
  };

  render() {
    const {selected, title} = this.state;
    return (
      <Badge
        value={title}
        badgeStyle={
          selected
            ? {
                backgroundColor: Colors.mainColor,
                borderWidth: 1,
                borderColor: Colors.mainColor,
                marginRight: 6,
                marginTop: 6,
                height: 24,
              }
            : {
                borderWidth: 1,
                borderColor: Colors.mainColor,
                backgroundColor: 'transparent',
                marginRight: 6,
                marginTop: 6,
                height: 24,
              }
        }
        textStyle={
          selected
            ? {fontSize: 16, color: 'white'}
            : {fontSize: 16, color: Colors.mainColor}
        }
        onPress={() => this.selectFilter(this.props.filter)}
      />
    );
  }
}

class TeamSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null,
      email: '',
      name: '',
      local: false,
    };
  }

  componentDidMount() {
    // this.resetSearch();
    let skills;
    listSkills().then(rec => {
      skills = rec.map(skl => ({
        key: skl.key,
        text: skl.key,
      }));
      this.setState({
        skills,
        email: this.itemValue('ema'),
        name: this.itemValue('nom'),
        local: this.itemValue('reg'),
        loaded: true,
      });
    });
    // this.setState({
    //   loaded: true,
    //   email: this.itemValue('ema'),
    //   name: this.itemValue('nom'),
    //   local: this.itemValue('reg'),
    // });
  }

  static navigationOptions = () => {
    return {
      title: 'Pesquisa',
      headerStyle: {
        backgroundColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
    };
  };

  // hab = (lst, k) => {
  //   return k;
  //   // const reg = userModel[lst].find(ele => ele.key === k);
  //   // if (reg) {
  //   //   return reg.text;
  //   // } else {
  //   //   return '???';
  //   // }
  // };

  searchUsers = () => {
    this.setIndexFilter('nom', '');
    if (this.state.name !== '') {
      this.setIndexFilter('nom', this.state.name);
    }
    this.props.navigation.state.params.onNavigateBack();
    this.props.navigation.goBack();
  };

  resetSearch = () => {
    this.setState({
      name: '',
    });
    this.props.resetUserSearch();
    this.props.navigation.state.params.onNavigateBack();
    this.props.navigation.goBack();
  };

  setIndexFilter = (feat, value) => {
    if (value !== '') {
      this.props.addUserSearch({attr: feat, opr: 'begins', val: value});
    } else {
      this.props.delUserSearchOper({attr: feat, opr: 'begins', val: value});
    }
  };

  setFilter = (selected, feat, value) => {
    if (!selected) {
      this.props.addUserSearch({attr: feat, opr: 'contains', val: value});
    } else {
      this.props.delUserSearch({attr: feat, opr: 'contains', val: value});
    }
  };

  setLocal = () => {
    const reg = this.props.reg ? this.props.reg.reg : '';
    if (!this.state.local) {
      this.props.addUserSearch({attr: 'reg', opr: '=', val: reg});
    } else {
      this.props.delUserSearch({attr: 'reg', opr: '=', val: reg});
    }
    this.setState({local: !this.state.local});
  };

  isSelected = (feat, value) => {
    const reg = this.props.search.user.find(
      ele => ele.attr === feat && ele.val === value,
    );
    if (reg) {
      return true;
    }
    return false;
  };

  itemValue = feat => {
    const reg = this.props.search.user.find(ele => ele.attr === feat);
    if (reg) {
      return feat === 'reg' || reg.val;
    }
    return '';
  };

  formatLocal = () => {
    if (this.props.reg && this.props.reg.reg) {
      const p = this.props.reg.reg.split('#');
      return `${p[2]}/${p[1]}`;
    }
    return '';
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <View
            style={{
              height: 60,
              borderBottomColor: 'silver',
              borderBottomWidth: 1,
            }}>
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                icon="refresh"
                onPress={() => this.resetSearch()}>
                Todos
              </Button>
              <Button
                mode="contained"
                icon="magnify"
                onPress={() => this.searchUsers()}>
                Pesquisar
              </Button>
            </View>
          </View>

          <ScrollView>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>DADOS PESSOAIS</Text>
              </View>
              <View style={styles.subItem}>
                <TextInput
                  label="Nome"
                  value={this.state.name}
                  style={{marginBottom: 8, backgroundColor: 'white'}}
                  onChangeText={text => this.setState({name: text})}
                />
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Apenas em {this.formatLocal()}</Text>
              </View>
              <View style={styles.subItem}>
                <Switch
                  value={this.state.local}
                  onValueChange={() => {
                    this.setLocal();
                  }}
                />
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>ESPECIALIDADES</Text>
              </View>
              <View style={styles.subContainer}>
                <View style={styles.listFlags}>
                  {this.state.skills.map(item => (
                    <FeatBadge
                      filter={this.setFilter}
                      selected={this.isSelected('skl', item.key)}
                      title={item.key}
                      feat="skl"
                      value={item.key}
                      key={item.key}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.actContainer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
  },
  subheader: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  title: {
    fontSize: 15,
    color: Colors.mainColor,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.lightColor,
    marginLeft: 20,
  },
  subItem: {
    margin: 8,
    flex: 1,
    marginTop: 5,
  },
  subContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  listFlags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeFlag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoTypeLabel: {
    fontSize: 14,
    textAlign: 'right',
    color: Colors.secColor,
    fontFamily: 'regular',
    paddingBottom: 10,
  },
  actContainer: {
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(searchActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TeamSearch);
