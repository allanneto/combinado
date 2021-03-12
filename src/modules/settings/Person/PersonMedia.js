/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  View,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {FAB} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import {getBaseS3, uploadS3} from '~/services/s3Api';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {readUser} from '~/services/usersApi';
import {updateUser} from '~/services/authApi';

const ww = Dimensions.get('window').width;

class PersonMedia extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      user: null,
      imgs: [],
    };
  }

  componentDidMount() {
    readUser(this.props.auth.user.ema).then(user => {
      this.setState({user: user, imgs: user.imgs || []});
    });
  }

  static navigationOptions = {
    title: 'Imagens e documentos',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  refresh = imgs => {
    this.setState({imgs: imgs});
  };

  viewItem(url, des) {
    this.props.navigation.navigate('PersonMediaView', {
      url: url,
      des: des,
      refresh: this.refresh,
    });
  }

  changeImage = () => {
    const options = {
      title: 'Nova imagem',
      chooseFromLibraryButtonTitle: 'Escolher imagem existente',
      takePhotoButtonTitle: 'Tirar uma foto',
      cancelButtonTitle: 'Cancelar',
      quality: 0.4,
      maxHeight: 1024,
      maxWidth: 1024,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (!response.error && !response.didCancel) {
        this.uploadImage(response);
      }
    });
  };

  uploadImage = async result => {
    this.setState({loading: true});
    const file = result.uri;
    const filename = file.split('/').pop();
    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';

    try {
      // const imageUrl = `avatars/${filename}`
      await uploadS3(file, filename, type, 'public/images/');
      // const newImage1 = await getImageUrl(imageUrl)
      const newImage = `${getBaseS3()}/images/${filename}`;
      this.state.imgs.push([newImage, '']);
      try {
        await updateUser({imgs: this.state.imgs});
        this.props.udateCurrentUser({imgs: this.state.imgs});
        this.setState({loading: false, error: null});
        this.viewItem(newImage);
      } catch (err) {
        this.setState({error: err.message});
      }
    } catch (err) {
      __DEV__ ? console.tron.log('ERRO', err) : console.log(err);
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
              {this.state.imgs.map(lin => (
                <TouchableWithoutFeedback
                  key={lin[0]}
                  onPress={() => this.viewItem(lin[0], lin[1])}>
                  <Image source={{uri: lin[0]}} style={styles.img} />
                </TouchableWithoutFeedback>
              ))}
            </View>
          </ScrollView>
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => this.changeImage()}
          />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 1,
    marginLeft: 1,
  },
  img: {
    width: (ww - 3) / 2,
    height: (ww - 3) / 2,
    marginRight: 1,
    marginBottom: 1,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 20,
    bottom: 20,
  },
  cmdContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
)(PersonMedia);
