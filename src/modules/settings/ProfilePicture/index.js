import React from 'react';
import {StyleSheet, StatusBar, View, ActivityIndicator} from 'react-native';

import {connect} from 'react-redux';
import {Text} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';

import * as Styled from './styles';
import {getImageUrl, getBaseS3, uploadS3} from '~/services/s3Api';
import {updateUser} from '~/services/authApi';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {oneTag} from '~/services/notificaApi';

global.Buffer = global.Buffer || require('buffer').Buffer;

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      photo: false,
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
      this.setState({
        photo: true,
      });

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

      this.props.navigation.goBack();
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
        <Styled.Container>
          <StatusBar
            translucent={true}
            backgroundColor={'transparent'}
            barStyle="dark-content"
          />
          <Styled.Header>
            <Styled.Text>Adicione uma foto</Styled.Text>
            <Styled.FIcon
              onPress={() => this.props.navigation.goBack()}
              name="close"
              size={35}
            />
          </Styled.Header>
          <Styled.Content>
            <Styled.Form>
              {!this.state.user.pic ||
              this.state.user.pic === '/images/anonymous.png' ? (
                <Styled.Avatar onPress={() => this.changeImage()}>
                  <Styled.Image
                    resizeMode="contain"
                    source={require('~/assets/images/photo.png')}
                  />
                </Styled.Avatar>
              ) : (
                <Styled.Avatar onPress={() => this.changeImage()}>
                  <Styled.Image
                    profile
                    resizeMode="contain"
                    source={{uri: this.state.image}}
                  />
                </Styled.Avatar>
              )}

              {this.state.loading && (
                <View>
                  <ActivityIndicator size="small" color="#661F85" />
                </View>
              )}

              <Styled.Main>
                <Styled.MainText>
                  Olá {this.props.auth.user.name}, vamos melhorar seu perfil.
                  Uma boa foto é o primeiro passo.
                </Styled.MainText>
              </Styled.Main>
              <Styled.Button
                // disabled={this.state.username ? false : true}
                onPress={() => this.changeImage()}>
                <Styled.ButtonGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#A2F902', '#D4E000']}>
                  <Styled.ButtonText>Tirar Foto</Styled.ButtonText>
                </Styled.ButtonGradient>
              </Styled.Button>
            </Styled.Form>
            <Styled.Footer onPress={() => this.props.navigation.goBack()}>
              <Styled.FooterImage
                resizeMode="contain"
                source={require('~/assets/images/rodape_cadastro.png')}
              />
              <Styled.FooterText>
                {this.state.photo ? 'CONCLUIR' : 'PULAR'}
              </Styled.FooterText>
            </Styled.Footer>
          </Styled.Content>
        </Styled.Container>
      );
    } else {
      return <Text>Carregando...</Text>;
    }
  }
}

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
