/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {NavigationActions} from 'react-navigation';

import {Text, ListItem, Icon} from 'react-native-elements';
import moment from 'moment';

import Colors from '../../config/Colors';
import {userModel} from '../../config/models';
import {readUser} from '~/services/usersApi';

class PersonScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      banks: userModel.banks,
      loading: false,
      user: null,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user});
    this.getStatusAccount();
  }

  getStatusAccount() {
    readUser(this.props.auth.user.ema).then(user => {
      this.setState({
        status: user.msg || 'Não validado',
      });
    });
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Meu perfil',
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

  getGender = cod => {
    const gen = userModel.gen.filter(lin => lin.key === cod);
    if (gen.length > 0) {
      return gen[0].text;
    }
    return '';
  };

  getAccType = cod => {
    const gen = userModel.tct.filter(lin => lin.key === cod);
    if (gen.length > 0) {
      return gen[0].text;
    }
    return '';
  };

  getAddr = (rua, nro, cid) => {
    return `${rua || ''} ${nro || ''} ${cid || ''}`;
  };

  getBank = cod => {
    const gen = this.state.banks.filter(lin => lin.key === cod);
    if (gen.length > 0) {
      return gen[0].text;
    }
    return null;
  };

  getCard = nro => {
    return this.props.auth.user.crn ? `**** ****** ${nro.substring(12)}` : null;
  };

  render() {
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.listStyle}>
              <View style={styles.sepStyle}>
                <Text style={styles.sectionText}>Dados cadastrais</Text>
              </View>
              <ListItem
                leftIcon={{
                  name: 'at-sign',
                  type: 'feather',
                  color: Colors.lightColor,
                }}
                bottomDivider
                title="E-Mail"
                subtitle={this.props.auth.user.ema}
              />
              <ListItem
                leftIcon={{
                  name: 'text-format',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                title="Nome"
                subtitle={this.props.auth.user.nom}
                onPress={() => this.props.navigation.navigate('PersonName')}
              />
              <ListItem
                leftIcon={{
                  name: 'venus-mars',
                  type: 'font-awesome',
                  color: Colors.lightColor,
                }}
                title="Genero"
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                subtitle={this.getGender(this.props.auth.user.gen)}
                onPress={() => this.props.navigation.navigate('PersonGender')}
              />
              <ListItem
                leftIcon={{
                  name: 'calendar-check-o',
                  type: 'font-awesome',
                  color: Colors.lightColor,
                }}
                title="Data de nascimento"
                subtitle={
                  this.props.auth.user.bir
                    ? moment(this.props.auth.user.bir, 'YYYY-MM-DD').format(
                        'DD/MM/YYYY',
                      )
                    : ''
                }
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonBirth')}
              />
              <ListItem
                leftIcon={{
                  name: 'location-on',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                title="Endereço"
                subtitle={this.props.auth.user.loc}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonLocal')}
              />
              <ListItem
                leftIcon={{
                  name: 'add-location',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                title="Número"
                subtitle={this.props.auth.user.num}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonNum')}
              />
              <ListItem
                leftIcon={{
                  name: 'add-location',
                  type: 'material-icons',
                  color: Colors.lightColor,
                }}
                title="Complemento"
                subtitle={this.props.auth.user.cpl}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() =>
                  this.props.navigation.navigate('PersonComplemento')
                }
              />
              <ListItem
                leftIcon={{
                  name: 'numeric',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                title="CEP"
                subtitle={this.props.auth.user.cep}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonCep')}
              />
              <ListItem
                leftIcon={{
                  name: 'cellphone-android',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                title="Telefone celular"
                subtitle={this.props.auth.user.cel}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonCell')}
              />
              {!this.props.auth.user.cnpj && (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="CPF"
                  subtitle={this.props.auth.user.cpf}
                  bottomDivider
                  chevron
                  subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                  onPress={() => this.props.navigation.navigate('PersonCPF')}
                />
              )}
              {!this.props.auth.user.cpf && (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="CNPJ"
                  bottomDivider
                  chevron
                  subtitle={this.props.auth.user.cnpj}
                  onPress={() => this.props.navigation.navigate('PersonCNPJ')}
                />
              )}
              <ListItem
                leftIcon={{
                  name: 'numeric',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                title="Incrição municipal"
                bottomDivider
                chevron
                subtitle={this.props.auth.user.insc}
                onPress={() => this.props.navigation.navigate('PersonInsc')}
              />
              <View style={styles.sepStyle}>
                <Text style={styles.sectionText}>Dados financeiros</Text>
              </View>
              {this.props.auth.user.prs ? (
                <ListItem
                  leftIcon={{
                    name: 'check',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="Validação da conta"
                  onPress={() => this.getStatusAccount()}
                  subtitle={this.state.status}
                  bottomDivider
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                />
              ) : null}
              {this.props.auth.user.prs ? (
                <ListItem
                  leftIcon={{
                    name: 'bank',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  onPress={() => this.props.navigation.navigate('PersonBanco')}
                  title="Banco"
                  bottomDivider
                  chevron
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                  subtitle={this.getBank(this.props.auth.user.ban)}
                />
              ) : null}
              {this.props.auth.user.prs ? (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="Agencia"
                  subtitle={this.props.auth.user.age}
                  bottomDivider
                  chevron
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('PersonAgencia')
                  }
                />
              ) : null}
              {this.props.auth.user.prs ? (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="Conta"
                  subtitle={this.props.auth.user.cta}
                  bottomDivider
                  chevron
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                  onPress={() => this.props.navigation.navigate('PersonConta')}
                />
              ) : null}
              {this.props.auth.user.prs ? (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="Tipo de Conta"
                  subtitle={this.getAccType(this.props.auth.user.tct)}
                  bottomDivider
                  chevron
                  subtitleStyle={{
                    color: Colors.mainColor,
                    fontWeight: 'bold',
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('PersonTipoConta')
                  }
                />
              ) : null}
              {this.props.auth.user.prs && !this.props.auth.user.cnpjcc && (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="CPF da Conta"
                  subtitle={this.props.auth.user.cpfcc}
                  bottomDivider
                  chevron
                  subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                  onPress={() => this.props.navigation.navigate('PersonAccCPF')}
                />
              )}
              {this.props.auth.user.prs && !this.props.auth.user.cpfcc && (
                <ListItem
                  leftIcon={{
                    name: 'numeric',
                    type: 'material-community',
                    color: Colors.lightColor,
                  }}
                  title="CNPJ da Conta"
                  bottomDivider
                  chevron
                  subtitle={this.props.auth.user.cnpjcc}
                  onPress={() =>
                    this.props.navigation.navigate('PersonAccCNPJ')
                  }
                />
              )}
              <ListItem
                leftIcon={{
                  name: 'credit-card',
                  type: 'entypo',
                  color: Colors.lightColor,
                }}
                title="Cartão de crédito"
                subtitle={this.getCard(this.props.auth.user.crn)}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                onPress={() => this.props.navigation.navigate('PersonCard')}
              />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return <Text>Carregando...</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  header: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  contentContainer: {
    backgroundColor: Colors.secColor,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
  },
  sepStyle: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.tabBar,
    borderBottomWidth: 1,
    borderColor: 'silver',
  },
  sectionText: {
    color: Colors.mainColor,
    fontWeight: 'bold',
  },
  helpText: {
    marginTop: 8,
    color: Colors.lightColor,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(PersonScreen);
