/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {updateUser} from '~/services/authApi';
import {readUser} from '~/services/usersApi';

const ww = Dimensions.get('window').width;

class PersonMediaView extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;

    this.state = {
      loading: false,
      error: null,
      url: params.url,
      des: params.des,
      refresh: params.refresh,
      ro: params.ro || false,
      user: null,
    };
  }

  componentDidMount() {
    readUser(this.props.auth.user.ema).then(user => {
      // const currImage = user.imgs.find(lin => lin[0] === this.props.navigation.state.params.url)
      this.setState({user: user, des: this.props.navigation.state.params.des});
    });
  }

  static navigationOptions = {
    title: 'Imagem ou documento',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  changeValue = value => {
    this.setState({
      error: null,
      des: value,
    });
  };

  deleteItem = async url => {
    Keyboard.dismiss();
    this.setState({loading: true});
    const imgs = this.state.user.imgs.filter(lin => lin[0] !== this.state.url);
    try {
      await updateUser({imgs: imgs});
      this.props.udateCurrentUser({imgs: imgs});
      this.setState({loading: false, error: null});
      this.state.refresh(imgs);
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({error: err.message});
    }
  };

  saveItem = async url => {
    Keyboard.dismiss();
    this.setState({loading: true});
    const imgs = this.state.user.imgs.map(lin =>
      lin[0] === this.state.url ? [this.state.url, this.state.des] : lin,
    );
    try {
      await updateUser({imgs: imgs});
      this.props.udateCurrentUser({imgs: imgs});
      this.setState({loading: false, error: null});
      this.state.refresh(imgs);
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
          <KeyboardAwareScrollView>
            <View style={styles.contentContainer}>
              <Image source={{uri: this.state.url}} style={styles.img} />
              <View style={styles.textContainer}>
                <Text style={styles.textLabel}>Descriçao</Text>
                <TextInput
                  value={this.state.des}
                  placeholder="Descrição da imagem"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  multiline
                  numberOfLines={4}
                  disabled={this.state.ro}
                  textAlignVertical="top"
                  style={{margin: 2, backgroundColor: 'white'}}
                  onChangeText={text => this.changeValue(text)}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
          {this.state.refresh ? (
            <View style={styles.cmdBar}>
              <Button
                uppercase={false}
                icon="delete"
                mode="contained"
                color={Colors.errorBackground}
                onPress={() => this.deleteItem()}>
                Excluir
              </Button>
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
)(PersonMediaView);
