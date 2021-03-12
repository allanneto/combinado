import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, TouchableOpacity, Alert, Text} from 'react-native';
import {updateWork} from '~/services/worksApi';

import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import moment from 'moment';

import Colors from '~/config/Colors';

class EventQRCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      loaded: false,
      error: null,
      data: '',
      ok: false,
    };
  }

  static navigationOptions = {
    title: 'Confirmar presença',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  componentDidMount() {
    const {work, updatePresence} = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      work,
      updatePresence,
      loaded: true,
      error: null,
    });
  }

  saveValue = () => {
    this.setState({loading: true});
    const work = this.state.work;
    work.pre = true;
    work.dhr = moment().format();
    updateWork(work)
      .then(() => {
        this.setState({loading: false, error: null});
        this.props.navigation.state.params.updatePresence(work.dhr);
        this.props.navigation.goBack();
        Alert.alert('Presença confirmada!');
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: 'Erro de gravação ' + err.message,
        });
      });
  };

  onSuccess = e => {
    const pts = e.data.split('#');
    let erro = false;
    if (pts.length < 2) {
      erro = true;
    } else {
      const [ema, dat] = pts;
      if (ema !== this.state.work.ema || dat !== this.state.work.dat) {
        erro = true;
      }
    }
    if (erro) {
      Alert.alert('QR code inválido: ' + e.data);
      this.scanner.reactivate();
    } else {
      this.setState({ok: true});
      // Alert.alert('Pressione Confirmar para completar');
    }
  };

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.loaded) {
      return (
        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker={true}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topViewStyle={styles.top}
          bottomViewStyle={styles.bottom}
          ref={elem => {
            this.scanner = elem;
          }}
          topContent={
            <View>
              <Text style={styles.textBold}>{this.state.work.nom}</Text>
              <Text style={styles.textBold}>
                Trabalho de {this.state.work.tsk}
              </Text>
            </View>
          }
          bottomContent={
            this.state.ok || __DEV__ ? (
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={this.saveValue}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.buttonTouchable}>
                <Text style={styles.buttonMsg}>Aguardando leitura...</Text>
              </View>
            )
          }
        />
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
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  centerText: {
    fontSize: 16,
    color: Colors.mainColor,
  },
  textBold: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.white,
  },
  buttonMsg: {
    fontSize: 16,
    color: Colors.secColor,
  },
  buttonTouchable: {
    padding: 16,
    color: Colors.white,
  },
  top: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
  },
  bottom: {
    backgroundColor: '#000',
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

export default connect(mapStateToProps)(EventQRCode);
