/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '~/config/Colors';
import {
  getEventStatus,
  getEventStyle,
  getSkillName,
} from '~/services/eventsApi';

import moment from 'moment';

class OrgCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user: null,
      org: props.org || false,
    };
  }

  componentDidMount() {
    this.setState({loaded: true});
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
    let fmtDate = 'DD/MM/YYYY HH:mm';
    if (this.props.item.sta === 2 || this.props.item.sta === 3) {
      fmtDate = 'DD/MM/YYYY';
    }
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View
          style={[
            styles.container,
            this.props.item.sta === 2 || this.props.item.sta === 3
              ? {backgroundColor: Colors.shadow}
              : null,
          ]}>
          <View style={styles.corpo}>
            <View style={styles.lista}>
              <Text style={styles.textCorpoType}>{this.props.item.tit}</Text>
              <Text style={styles.textCorpo}>{this.props.item.loc}</Text>
            </View>
          </View>

          <View style={styles.corpo}>
            <View style={styles.lista}>
              <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                Início
              </Text>
              <Text style={styles.textCorpo}>
                {this.props.item.ini
                  ? moment(this.props.item.ini).format(fmtDate)
                  : ''}
              </Text>
            </View>
            <View style={styles.lista}>
              <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>Fim</Text>
              <Text style={styles.textCorpo}>
                {this.props.item.fim
                  ? moment(this.props.item.fim).format(fmtDate)
                  : ''}
              </Text>
            </View>
            <View style={styles.lista}>
              <Text style={[styles.textCorpo, {fontWeight: 'bold'}]}>
                Situação
              </Text>
              <Text style={getEventStyle(this.props.item)}>
                {getEventStatus(this.props.item)}
              </Text>
            </View>
          </View>
          {this.props.item.sta !== 2 && this.props.item.sta !== 3 ? (
            <View style={styles.footer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="user-circle-o"
                    type="font-awesome"
                    color={Colors.mainColor}
                    size={14}
                  />
                  <Text style={styles.textHeadFooter}>Vagas</Text>
                </View>
                <View>
                  {this.props.item.pgm === 'd' ? (
                    <Icon
                      name="cash-multiple"
                      type="material-community"
                      color={Colors.mainColor}
                      size={15}
                    />
                  ) : this.props.item.pgm === 'c' ? (
                    <Icon
                      name="credit-card"
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
              {this.props.item.tsk
                ? this.props.item.tsk.map(job => (
                    <View style={styles.job} key={job.key}>
                      <Text style={styles.textFooter}>
                        {getSkillName(job.key)}: {job.qtd}
                      </Text>
                    </View>
                  ))
                : null}
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
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

  lista: {
    flex: 1,
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },

  esquerda: {
    flex: 1,
  },
  direita: {
    flex: 1,
    alignItems: 'flex-end',
  },
  footer: {
    flex: 1,
    marginTop: 8,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopColor: Colors.lightFG,
    borderTopWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
    margin: 4,
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

export default OrgCard;
