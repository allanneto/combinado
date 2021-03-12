/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import {Badge, Avatar, Divider, Rating, Icon} from 'react-native-elements';
import {Button, Text} from 'react-native-paper';
import {NavigationActions} from 'react-navigation';

import {getImageUrl} from '~/services/s3Api';
import {userModel} from '~/config/models';
import Colors from '~/config/Colors';
import {readUser} from '~/services/usersApi';
import {createNotification} from '~/services/notificaApi';

import {getWork, insertWorkUser, deleteWork} from '~/services/worksApi';

import moment from 'moment';
const ww = Dimensions.get('window').width;

const FeatBadge = ({title}) => {
  return (
    <Badge
      value={title}
      badgeStyle={{
        backgroundColor: Colors.mainColor,
        marginRight: 6,
        marginBottom: 6,
        padding: 4,
        height: 28,
      }}
      textStyle={{fontSize: 15, color: Colors.white}}
    />
  );
};

class UserData extends React.Component {
  constructor(props) {
    super(props);
    const {params} = this.props.navigation.state;
    this.state = {
      ok: false,
      user: null,
      ro: params ? params.ro : true,
      image: null,
      user_incl: params ? params.user_incl || false : false,
      emp: params ? params.emp : null,
      nav: params ? params.nav : null,
      event: params ? params.event : null,
      skill: params ? params.skill : null,
      val: params ? params.val : null,
    };
  }

  componentDidMount() {
    if (!this.props.navigation.state.params) {
      readUser(this.props.auth.user.ema).then(user => {
        getImageUrl(user.pic).then(image => {
          this.setState({user: user, image, ok: true});
        });
      });
    } else {
      // read the user
      const {ema} = this.props.navigation.state.params;
      readUser(ema)
        .then(user => {
          if (!user.ema) {
            this.setState({message: 'Registro não encontrado'});
          } else {
            getImageUrl(user.pic).then(image => {
              this.setState({user: user, image, ok: true});
            });
          }
        })
        .catch(err => {
          this.setState({message: err.message});
        });
    }
  }

  static navigationOptions = ({navigation}) => {
    const options = {
      title: 'Profissional',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
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
    if (!navigation.state.params) {
      options.headerLeft = () => (
        <View style={{marginLeft: 8}}>
          <Icon
            name="chevron-left"
            color={Colors.white}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          />
        </View>
      );
    }
    return options;
  };

  hab = (lst, k) => {
    const reg = userModel[lst].find(ele => ele.key === k);
    if (reg) {
      return reg.text;
    } else {
      return k;
    }
  };

  loc = reg => {
    return `${reg.rua || ''} ${reg.nro || ''} ${reg.bai || ''} ${reg.cid ||
      ''} ${reg.uf || ''}`;
  };

  insertUserTeam = async () => {
    const is_debug = false;
    this.setState({loading: true});
    try {
      const work = await getWork(
        this.state.user.ema,
        this.state.event.dat,
        this.state.event.ema,
        this.state.skill,
      );
      if (work && work.emp) {
        this.setState({loading: false});
        Alert.alert('Erro', 'Prestador já incluido na vaga');
        return;
      }
      if (is_debug) {
        insertWorkUser(this.state.user, this.state.event, this.state.skill);
      } else {
        const when = moment(this.state.event.ini).format('DD/MM/YYYY HH:mm');
        const vaga = this.state.skill;
        const msgs = `Você foi convidado para vaga de ${vaga} em ${when}`;
        createNotification(
          this.state.user.ema,
          msgs,
          this.state.event.tit,
          this.state.user,
          this.state.event,
          this.state.skill,
          3,
        );
      }
      this.setState({loading: false});
      this.props.navigation.state.params.onNavigateBack();
      this.props.navigation.goBack(this.state.nav);
    } catch (err) {
      this.setState({loading: false});
      Alert.alert('Erro', err.message);
    }
  };

  deleteUserTeam = async () => {
    this.setState({working: true});
    try {
      await deleteWork(
        this.state.emp,
        this.state.event.dat,
        this.state.event.ema,
        this.state.skill,
      );
      const user = await readUser(this.state.emp);
      const when = moment(this.state.event.ini).format('DD/MM/YYYY HH:mm');
      const vaga = this.state.skill;
      const msgs = `Você foi retirado da vaga de ${vaga} no evento em ${when}`;
      createNotification(
        this.state.emp,
        msgs,
        this.state.event.tit,
        user,
        this.state.event,
        this.state.skill,
        2,
      );
      this.setState({working: false});
      this.props.navigation.state.params.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({working: false});
      Alert.alert('Erro', err.message);
    }
  };

  handleViewHist = () => {
    this.props.navigation.navigate('UserAvalHist', {
      ema: this.state.user.ema,
    });
  };

  viewItem(url, des) {
    this.props.navigation.navigate('PersonMediaView', {
      url: url,
      des: des,
      ro: true,
    });
  }

  openItem = url => {
    this.props.navigation.navigate('LinkView', {url: url});
  };

  render() {
    if (this.state.ok) {
      return (
        <View style={styles.container}>
          {this.state.event && !this.state.user_incl && !this.state.ro ? (
            <View style={{height: 58}}>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon="email"
                  loading={this.state.loading}
                  onPress={() => this.insertUserTeam()}>
                  Convidar para a vaga
                </Button>
              </View>
            </View>
          ) : null}
          {this.state.event && this.state.user_incl && !this.state.ro ? (
            <View style={{height: 58}}>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon="delete"
                  loading={this.state.loading}
                  onPress={() => this.deleteUserTeam()}>
                  Remover da vaga
                </Button>
              </View>
            </View>
          ) : null}

          <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: Colors.white,
              }}>
              {!this.state.image ||
              this.state.image === '/images/anonymous.png' ? (
                <Avatar
                  size="xlarge"
                  rounded
                  icon={{name: 'user', type: 'font-awesome'}}
                />
              ) : (
                <Avatar
                  size="xlarge"
                  rounded
                  source={{uri: this.state.image}}
                />
              )}
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4,
                flexDirection: 'row',
                backgroundColor: Colors.white,
              }}>
              <Rating
                readonly
                showRating={false}
                startingValue={this.state.user.avl || 0}
                imageSize={16}
              />
              <View style={{marginLeft: 8, flexDirection: 'row'}}>
                <Text style={styles.avalLabel}>{this.state.user.avl || 0}</Text>
                <Text style={styles.avalMax}> / 5</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: 4,
                marginBottom: 8,
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  color: Colors.mainColor,
                }}>
                {this.state.user.nom}
              </Text>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 10}}>
              <View style={styles.subTitle}>
                <Text style={styles.titleText}>ESPECIALIDADES</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 10,
                }}>
                {this.state.user.skl ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 10,
                    }}>
                    {this.state.user.skl.map(item => (
                      <FeatBadge title={this.hab('skl', item)} key={item} />
                    ))}
                  </View>
                ) : (
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'silver',
                    }}>
                    Não informado
                  </Text>
                )}
              </View>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 10}}>
              <View style={styles.subTitle}>
                <Text style={styles.titleText}>SOBRE MIM</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                }}>
                <Text style={styles.infoDesc}>{this.state.user.desc}</Text>
              </View>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 10}}>
              <View style={styles.subTitle}>
                <Text style={styles.titleText}>INFORMAÇÕES</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginHorizontal: 20,
                }}>
                <View style={{flex: 1}}>
                  <Text style={styles.infoTypeLabel}>Genero</Text>
                  <Text style={styles.infoTypeLabel}>Aniversário</Text>
                </View>
                <View style={{flex: 2, marginLeft: 4}}>
                  <Text style={styles.infoAnswerLabel}>
                    {this.hab('gen', this.state.user.gen) || ' '}
                  </Text>
                  <Text style={styles.infoAnswerLabel}>
                    {this.state.user.bir
                      ? moment(this.state.user.bir).format('DD/MM/YYYY')
                      : ' '}
                  </Text>
                </View>
              </View>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 4}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}>
                {this.state.user.qav > 0 ? (
                  <Button
                    // mode='outlined'
                    icon="star"
                    color={Colors.bluish}
                    onPress={this.handleViewHist}>
                    {this.state.user.qav}{' '}
                    {this.state.user.qav > 1 ? 'avaliações' : 'avaliação'}
                  </Button>
                ) : (
                  <Button mode="text" color={Colors.bluish}>
                    Nenhuma avaliação
                  </Button>
                )}
              </View>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 10, marginBottom: 10}}>
              <View style={styles.subTitle}>
                <Text style={styles.titleText}>FOTOS</Text>
              </View>

              <SafeAreaView style={styles.container}>
                <FlatList
                  horizontal
                  data={this.state.user.imgs || []}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      key={item[0]}
                      onPress={() => this.viewItem(item[0], item[1])}>
                      <Image source={{uri: item[0]}} style={styles.img} />
                    </TouchableWithoutFeedback>
                  )}
                  keyExtractor={item => item[0]}
                />
              </SafeAreaView>
            </View>

            <Divider />
            <View style={{flex: 1, marginTop: 10}}>
              <View style={styles.subTitle}>
                <Text style={styles.titleText}>PÁGINAS EXTERNAS</Text>
              </View>
              <SafeAreaView style={styles.container}>
                <FlatList
                  horizontal
                  data={this.state.user.lnks || []}
                  renderItem={({item}) => (
                    <View style={styles.lnk}>
                      <TouchableWithoutFeedback
                        key={item[0]}
                        onPress={() => this.openItem(item[0])}>
                        <Text style={styles.lnkText}>{item[1]}</Text>
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                  keyExtractor={item => item[0]}
                />
              </SafeAreaView>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.actContainer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.white,
    // marginTop: 10
  },
  hList: {
    flex: 1,
    marginBottom: 10,
  },
  subTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lnkText: {
    color: Colors.mainColor,
  },
  titleText: {
    color: Colors.bluish,
    fontWeight: 'bold',
  },
  infoDesc: {
    fontSize: 14,
    color: Colors.mainColor,
    paddingBottom: 10,
  },
  infoTypeLabel: {
    fontSize: 14,
    paddingBottom: 10,
  },
  infoAnswerLabel: {
    fontSize: 14,
    color: Colors.lightColor,
    paddingBottom: 10,
  },
  avalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  avalMax: {
    fontSize: 18,
    color: Colors.lightFG,
  },
  buttonContainer: {
    backgroundColor: Colors.secColor,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  actContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: (ww - 3) / 4,
    height: (ww - 3) / 4,
    marginRight: 1,
    marginBottom: 1,
  },
  lnk: {
    width: (ww - 2) / 3,
    height: (ww - 2) / 9,
    marginRight: 1,
    marginBottom: 1,
    padding: 8,
    flex: 1,
    borderRightColor: 'silver',
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(UserData);
