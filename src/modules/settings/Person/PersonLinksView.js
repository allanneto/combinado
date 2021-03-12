/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Alert,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';
import {readUser} from '~/services/usersApi';

const ww = Dimensions.get('window').width;

class PersonLinksView extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;

    this.state = {
      loading: false,
      error: null,
      url: params.url,
      url1: params.url,
      refresh: params.refresh,
      user: null,
    };
  }

  componentDidMount() {
    readUser(this.props.auth.user.ema).then(user => {
      let lin = [];
      if (this.props.navigation.state.params.url) {
        lin = user.lnks.find(
          lin => lin[0] === this.props.navigation.state.params.url,
        );
      } else {
        lin = ['', ''];
      }
      this.setState({user: user, url: lin[0], des: lin[1]});
    });
  }

  static navigationOptions = {
    title: 'Link externo',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeUrl = value => {
    this.setState({
      error: null,
      url: value,
    });
  };

  changeDes = value => {
    this.setState({
      error: null,
      des: value,
    });
  };

  deleteItem = async url => {
    Keyboard.dismiss();
    this.setState({loading: true});
    const lnks = this.state.user.lnks.filter(lin => lin[0] !== this.state.url);
    try {
      await updateUser({lnks: lnks});
      this.props.udateCurrentUser({lnks: lnks});
      this.setState({loading: false, error: null});
      this.state.refresh(lnks);
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: err.message});
    }
  };

  testItem = () => {
    this.props.navigation.navigate('LinkView', {url: this.state.url});
  };

  saveItem = async url => {
    Keyboard.dismiss();
    if (this.state.url.substring(0, 8) !== 'https://') {
      this.setState({error: 'Endereço deve iniciar com https://'});
      return;
    }
    this.setState({loading: true});
    let lnks = [];
    if (this.props.navigation.state.params.url) {
      lnks = this.state.user.lnks.map(lin =>
        lin[0] === this.state.url1 ? [this.state.url, this.state.des] : lin,
      );
    } else {
      lnks = this.state.user.lnks || [];
      lnks.push([this.state.url, this.state.des]);
    }
    try {
      await updateUser({lnks: lnks});
      this.props.udateCurrentUser({lnks: lnks});
      this.setState({loading: false, error: null});
      this.state.refresh(lnks);
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: err.message});
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.contentContainer}>
              {/* <Image source={{ uri: this.state.url }} style={styles.img} /> */}
              <View style={styles.textContainer}>
                <TextInput
                  label="Endereço (https)"
                  value={this.state.url}
                  placeholder="Link URL"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  style={{margin: 2, backgroundColor: 'white'}}
                  onChangeText={text => this.changeUrl(text)}
                />
                <TextInput
                  label="Descrição"
                  value={this.state.des}
                  placeholder="Descrição do link"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  style={{margin: 2, backgroundColor: 'white'}}
                  onChangeText={text => this.changeDes(text)}
                />
              </View>
            </View>
          </ScrollView>
          {this.state.url && this.state.des ? (
            <View style={styles.cmdBar}>
              {this.props.navigation.state.params.url ? (
                <Button
                  uppercase={false}
                  icon="delete"
                  mode="contained"
                  color={Colors.errorBackground}
                  onPress={() => this.deleteItem()}>
                  Excluir
                </Button>
              ) : null}
              {this.props.navigation.state.params.url ? (
                <Button
                  uppercase={false}
                  icon="share"
                  mode="contained"
                  color={Colors.secColor}
                  onPress={() => this.testItem()}>
                  Testar
                </Button>
              ) : null}
              <Button
                uppercase={false}
                icon="check"
                mode="contained"
                color={Colors.mainColor}
                onPress={() => this.saveItem()}>
                Salvar
              </Button>
            </View>
          ) : null}
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
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  textContainer: {
    margin: 4,
  },
  textLabel: {
    color: Colors.bluish,
    fontWeight: 'bold',
  },
  img: {
    width: ww - 2,
    height: ww - 2,
  },
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    backgroundColor: Colors.lightBG,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
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
)(PersonLinksView);
