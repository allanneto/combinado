/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {NavigationActions} from 'react-navigation';

import {connect} from 'react-redux';
import {Text, ListItem, Avatar, Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import Colors from '~/config/Colors';
import {getImageUrl, getBaseS3, uploadS3} from '../../services/s3Api';
import {updateUser} from '~/services/authApi';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {oneTag} from '~/services/notificaApi';

global.Buffer = global.Buffer || require('buffer').Buffer;

class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Perfil',
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
      loading: false,
      user: null,
    };
  }

  componentDidMount() {
    getImageUrl(this.props.auth.user.pic).then(image => {
      this.setState({user: this.props.auth.user, image});
    });
  }

  updateImage(name) {
    getImageUrl(name).then(image => {
      this.setState({image});
    });
  }

  changeImage = () => {
    const options = {
      title: 'Nova foto',
      chooseFromLibraryButtonTitle: 'Escolher foto existente',
      takePhotoButtonTitle: 'Tirar nova foto',
      cancelButtonTitle: 'Cancelar',
      quality: 0.2,
      maxHeight: 1024,
      maxWidth: 1024,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (!response.error && !response.didCancel) {
        this.onUpload(response);
      }
    });
  };

  onUpload = async result => {
    this.setState({loading: true});
    const file = result.uri;
    const filename = file.split('/').pop();
    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    try {
      // const imageUrl = `avatars/${filename}`
      await uploadS3(file, filename, type, 'public/avatars/');
      // const newImage1 = await getImageUrl(imageUrl)
      const newImage = `${getBaseS3()}/avatars/${filename}`;
      await updateUser({pic: newImage});
      this.props.udateCurrentUser({pic: newImage});
      this.setState({
        loading: false,
        image: newImage,
        user: {...this.state.user, pic: newImage},
      });
      this.props.navigation.state.params.onNavigateBack(newImage);
    } catch (err) {
      __DEV__ ? console.tron.log('ERRO', err) : console.log(err);
    }
  };

  changeStatus = async () => {
    const prs = this.state.user.prs === 1 ? 0 : 1;
    await updateUser({prs});
    this.props.udateCurrentUser({prs});
    this.setState({
      user: {...this.state.user, prs},
    });
    oneTag(this.props.auth.user.userId);
  };

  render() {
    if (this.state.user) {
      return (
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              {!this.state.user.pic ||
              this.state.user.pic === '/images/anonymous.png' ? (
                <Avatar
                  size="xlarge"
                  rounded
                  icon={{name: 'user', type: 'font-awesome'}}
                  onPress={() => this.changeImage()}
                />
              ) : (
                <Avatar
                  size="xlarge"
                  rounded
                  source={{uri: this.state.image}}
                  onPress={() => this.changeImage()}
                />
              )}
              {this.state.loading ? (
                <View style={styles.actContainer}>
                  <ActivityIndicator size="small" color="#661F85" />
                  <Text style={styles.helpText}> aguarde...</Text>
                </View>
              ) : (
                <View style={styles.actContainer}>
                  <Text style={styles.helpText}>
                    Toque na foto para alterar
                  </Text>
                </View>
              )}
            </View>
            <ListItem
              title="E-mail"
              bottomDivider
              subtitle={this.props.auth.user.email}
              subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
            />
            <ListItem
              switch={{
                value: this.state.user.prs === 1,
                onValueChange: this.changeStatus,
              }}
              bottomDivider
              title="Sou prestador de serviços"
            />
            {/* <ListItem
              leftIcon={{ name: 'fingerprint' }}
              bottomDivider
              onPress={() => this.props.navigation.navigate('ProfilePassword')}
              title='Trocar a senha'
            />
            <ListItem
              bottomDivider
              leftIcon={{ name: 'warning', color: 'red' }}
              onPress={() => this.props.navigation.navigate('ProfileDelete')}
              title='Excluir sua conta'
            /> */}
          </View>
        </ScrollView>
      );
    } else {
      return <Text>Carregando...</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  contentContainer: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  helpText: {
    color: Colors.lightColor,
  },
  cmdContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  bindActionCreators(authActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileScreen);
