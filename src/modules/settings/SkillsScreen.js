/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, ScrollView, Text, Image} from 'react-native';
import {NavigationEvents, NavigationActions} from 'react-navigation';
import {ListItem, Icon} from 'react-native-elements';

import {listSkills} from '~/services/eventsApi';

import Colors from '~/config/Colors';
import {getImageUrl} from '~/services/s3Api';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '../../redux/ducks/auth';
import {updateUser} from '~/services/authApi';
import {oneTag} from '~/services/notificaApi';

class SkillItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    getImageUrl(this.props.lin.pic).then(image => {
      this.setState({loaded: true, image});
    });
  }

  hasCraft = (key, lst) => {
    const test = lst.filter(item => item === key).length;
    return test > 0;
  };

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <ListItem
        switch={{
          value: this.hasCraft(this.props.lin.key, this.props.item),
          onValueChange: () => this.props.change(this.props.lin.key),
        }}
        bottomDivider
        leftAvatar={
          <Image
            source={{uri: this.state.image}}
            style={{width: 36, height: 36}}
          />
        }
        title={this.props.lin.key}
        key={this.props.lin.key}
        titleStyle={
          this.hasCraft(this.props.lin.key, this.props.item)
            ? styles.title2
            : styles.title1
        }
      />
    );
  }
}

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Minhas especialidades',
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

  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => {
    listSkills().then(rec => {
      const skills = rec.map(skl => ({
        key: skl.key,
        pic: skl.pic,
      }));
      this.setState({
        skills,
        item: this.props.auth.user.skl ? this.props.auth.user.skl : [],
        loaded: true,
        error: null,
      });
    });
  };

  hasCraft = (key, lst) => {
    const test = lst.filter(item => item === key).length;
    return test > 0;
  };

  changeValue = async value => {
    let lst = this.state.item ? this.state.item : [];
    const checked = this.hasCraft(value, lst);
    if (!checked) {
      lst.push(value);
    } else {
      lst = lst.filter(e => e !== value);
    }
    try {
      await updateUser({skl: lst});
      oneTag(this.props.auth.user.ema);
      this.props.udateCurrentUser({skl: lst});
      this.setState({item: lst, error: null});
    } catch (err) {
      this.setState({error: err.message});
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
      this.setState({error: null});
    }
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <NavigationEvents onDidFocus={this.handleRefresh} />
          <ScrollView>
            <View style={styles.listStyle}>
              <View style={styles.sepStyle}>
                <Text style={styles.sectionText}>
                  Selecione uma ou mais especialidades
                </Text>
              </View>
              {this.state.skills.map(lin => (
                <SkillItem
                  lin={lin}
                  item={this.state.item}
                  change={this.changeValue}
                />
              ))}
              <View style={styles.sepStyle}>
                <Text style={styles.sectionText}>Mais informações</Text>
              </View>
              <ListItem
                leftIcon={{
                  name: 'comment-text-outline',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                title="Descrição geral"
                subtitle="Informações sobre você e sua capacidade"
                onPress={() => this.props.navigation.navigate('PersonInfo')}
              />
              <ListItem
                leftIcon={{
                  name: 'camera-outline',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                title="Você em evidência"
                subtitle="Fotos adicionais, documentos e certificados"
                onPress={() => this.props.navigation.navigate('PersonMedia')}
              />
              <ListItem
                leftIcon={{
                  name: 'cast',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                title="Social"
                subtitle="Sites, apresentações e outros links sobre você"
                onPress={() => this.props.navigation.navigate('PersonLinks')}
              />
            </View>
          </ScrollView>
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
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  title1: {
    color: Colors.lightColor,
  },
  title2: {
    color: Colors.bluish,
    fontWeight: 'bold',
  },
  sepStyle: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tabBar,
    borderBottomWidth: 1,
    borderColor: 'silver',
  },
  header: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  contentContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
  },
  cmdContainer: {
    alignItems: 'center',
    padding: 12,
  },
  buttonStyle: {
    backgroundColor: Colors.lightColor,
    borderColor: Colors.lightColor,
    borderWidth: 1,
    borderRadius: 4,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators(authActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Skills);
