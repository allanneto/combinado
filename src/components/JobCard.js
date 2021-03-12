/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '~/config/Colors';
import {getImageUrl} from '~/services/s3Api';

import moment from 'moment';

class JobCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null,
      waitNotif: false,
      org: props.org || [],
    };
  }

  componentDidMount() {
    getImageUrl(this.props.item.pic).then(image => {
      this.setState({
        loaded: true,
        image,
      });
    });
  }

  sent() {
    const x = this.props.org.find(
      rg =>
        rg.ema === this.props.item.ema &&
        rg.dat === this.props.item.dat &&
        rg.tsk === this.props.item.tsk,
    );
    if (x) {
      return true;
    } else {
      return false;
    }
  }

  getName(name) {
    const ps = name.split(/\s+/);
    if (ps.length === 1) {
      return name;
    }
    if (ps.length > 1) {
      return `${ps[0]} ${ps[ps.length - 1]}`;
    }
    return '';
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={this.sent() ? styles.container2 : styles.container}>
          <View style={styles.corpo}>
            <View style={styles.esquerda}>
              <View style={styles.img}>
                <Image
                  source={{uri: this.state.image || ''}}
                  style={{width: 26, height: 26}}
                />
              </View>
            </View>
            <View style={styles.lista}>
              <Text style={styles.textCorpoType}>{this.props.item.tsk}</Text>
              <Text style={styles.textCorpo}>{this.props.item.tit}</Text>
            </View>
            {this.sent() ? (
              <View style={styles.listaxx}>
                <Text style={{color: Colors.secColor}}>Solicitada</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.corpo}>
            <View style={styles.lista}>
              <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                Início
              </Text>
              <Text style={styles.textCorpo}>
                {this.props.item.ini
                  ? moment(this.props.item.ini).format('DD/MM/YYYY HH:mm')
                  : ''}
              </Text>
            </View>
            <View style={styles.lista}>
              <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>Fim</Text>
              <Text style={styles.textCorpo}>
                {this.props.item.fim
                  ? moment(this.props.item.fim).format('DD/MM/YYYY HH:mm')
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="user-circle-o"
                type="font-awesome"
                color={Colors.mainColor}
                size={14}
              />
              <Text style={styles.textHeadFooter}>Vagas:</Text>
              <Text style={styles.textHeadFooter}>
                {`${this.props.item.qpr || 0}/${this.props.item.qtd}`}
              </Text>
              <Text style={styles.textHeadFooter}>Valor:</Text>
              <Text style={styles.textHeadFooter}>
                {parseFloat(this.props.item.val).toFixed(2)}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              {this.props.item.pgm === 'd' ? (
                <Icon
                  name="cash-multiple"
                  type="material-community"
                  color={Colors.mainColor}
                  size={15}
                />
              ) : (
                <Icon
                  name="bank"
                  type="material-community"
                  color={Colors.mainColor}
                  size={15}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 6,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  container2: {
    flex: 1,
    backgroundColor: Colors.white,
    marginTop: 8,
    marginHorizontal: 8,
    borderRadius: 6,
    borderTopColor: Colors.secColor,
    borderTopWidth: 3,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    margin: 8,
  },
  textHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  textCorpo: {
    fontSize: 14,
  },
  textCorpoType: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 4,
    color: Colors.bluish,
  },
  corpo: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  corpo1: {
    flexDirection: 'row',
    marginTop: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  img: {
    marginTop: 4,
    marginLeft: 4,
    marginRight: 2,
  },
  lista: {
    flex: 1,
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopColor: Colors.lightFG,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  job: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  textHeadFooter: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: Colors.mainColor,
  },
  textFooter: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.lightColor,
  },
});

export default JobCard;
