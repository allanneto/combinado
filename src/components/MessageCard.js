/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '~/config/Colors';
import {getImageUrl} from '~/services/s3Api';
import {skillName} from '~/config/models';
import moment from 'moment';

// const truncate = (str, nr) => {
//   const ending = '...';
//   const mxw = str.split(' ');
//   const nrw = str.split(' ', nr);
//   if (mxw.length > nr) {
//     return nrw.join(' ') + ending;
//   } else {
//     return str;
//   }
// };

class MessageCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      user: null,
    };
  }

  componentDidMount() {
    getImageUrl(this.props.uri).then(image => {
      this.setState({
        loaded: true,
        image,
        skill_name: skillName(this.props.skill),
      });
    });
  }

  getHour(dta) {
    return moment(dta).format('DD/MM/YYYY HH:mm:ss');
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={styles.container}>
          <View style={styles.header}>
            {this.props.item.sta !== 7 && (
              <Image source={{uri: this.props.item.pic}} style={styles.icon} />
            )}
            <View style={styles.subhead}>
              <Text style={styles.textHeader}>{this.props.item.nom}</Text>
              <View style={styles.dateComp}>
                <Icon
                  name="clock-o"
                  type="font-awesome"
                  color={Colors.lightColor}
                  size={12}
                />
                <Text style={styles.date}>
                  {this.getHour(this.props.item.tms)}
                </Text>
              </View>
            </View>
            <View>
              {this.props.item.sta === 0 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="clock-o"
                    type="font-awesome"
                    color={Colors.lightColor}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                    A responder
                  </Text>
                </View>
              ) : this.props.item.sta === 1 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="thumbs-o-up"
                    type="font-awesome"
                    color={Colors.greenish}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.greenish}]}>
                    Aceita
                  </Text>
                </View>
              ) : this.props.item.sta === 2 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="thumbs-o-down"
                    type="font-awesome"
                    color={Colors.errorBackground}
                    size={14}
                  />
                  <Text
                    style={[
                      styles.textFooter,
                      {color: Colors.errorBackground},
                    ]}>
                    Rejeitada
                  </Text>
                </View>
              ) : this.props.item.sta === 3 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="email-outline"
                    type="material-community"
                    color={Colors.mainColor}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.mainColor}]}>
                    Convite
                  </Text>
                </View>
              ) : this.props.item.sta === 4 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="comment-multiple-outline"
                    type="material-community"
                    color={Colors.mainColor}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.mainColor}]}>
                    Chat
                  </Text>
                </View>
              ) : this.props.item.sta === 5 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    type="material"
                    color={Colors.lightColor}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                    Respondida
                  </Text>
                </View>
              ) : this.props.item.sta === 6 ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="check"
                    type="material"
                    color={Colors.bluish}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                    Pago
                  </Text>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    name="info-outline"
                    type="material"
                    color={Colors.bluish}
                    size={14}
                  />
                  <Text style={[styles.textFooter, {color: Colors.bluish}]}>
                    Mensagem
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.foot}>
            <View style={styles.footer}>
              <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                {this.props.item.tit}
              </Text>
            </View>
            {this.props.item.txt && (
              <View style={styles.footer}>
                <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                  {this.props.item.txt}
                </Text>
              </View>
            )}
            {this.props.item.tsk && (
              <View style={styles.footer}>
                <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                  {this.props.item.tsk}
                </Text>
              </View>
            )}
            {/* <View style={styles.footer}>
              <Text style={[styles.textFooter, {color: Colors.lightColor}]}>
                {moment(this.props.item.dat).format('DD/MM/YYYY')}
              </Text>
            </View> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 6,
    marginHorizontal: 6,
    borderRadius: 6,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 2,
  },
  icon: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    width: 36,
    height: 36,
  },
  subhead: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  textHeader: {
    fontSize: 16,
  },
  dateComp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
    color: Colors.lightColor,
  },
  title: {
    fontSize: 17,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    marginHorizontal: 12,
    marginBottom: 6,
    color: Colors.lightColor,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
  },
  foot: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  textFooter: {
    fontSize: 14,
    marginLeft: 4,
    color: Colors.lightColor,
  },
});

export default MessageCard;
