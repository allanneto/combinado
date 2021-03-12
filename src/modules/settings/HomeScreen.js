/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text, Card} from 'react-native-elements';

import Colors from '../../config/Colors';
import ver from '../../config/version';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({user: this.props.auth.user});
  }

  static navigationOptions = {
    title: 'Sobre o Hypemax',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.headText}>Bem-vindo ao Combinado</Text>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.helpContainer1}>
              <Card image={require('../../assets/images/hype.jpg')}>
                <Text style={styles.headText}>Casting agora é aqui!</Text>
                <Text style={styles.infoText}>
                  Contrate e seja contratado para trabalhos freelance
                  diretamente pela plataforma e ainda ganhe prêmios por
                  participação e engajamento. Faça parte do jogo!
                </Text>
                <Text style={styles.headText}>
                  A qualquer hora e de qualquer lugar
                </Text>
              </Card>

              <Card image={require('../../assets/images/ranking.jpg')}>
                <Text style={styles.headText}>Ranking</Text>
                <Text style={styles.infoText}>
                  O sistema tem uma inteligência que pontua os usuários com
                  melhor desempenho. Assim você sabe quem tem boas recomendações
                  no mercado de trabalho e também pode se destacar por atuar de
                  maneira eficaz e honesta.
                </Text>
              </Card>

              <Card image={require('../../assets/images/organiz.jpg')}>
                <Text style={styles.headText}>Organização</Text>
                <Text style={styles.infoText}>
                  Com a Hypemax é muito mais fácil se organizar com datas de
                  trabalhos, pagamentos etc. Você não precisa mais usar diversas
                  ferramentas (e-mail, agenda, facebook, whatsapp, excel) para
                  trabalhar, tudo que você precisa você encontra aqui.
                </Text>
              </Card>
              <Card image={require('../../assets/images/time.jpg')}>
                <Text style={styles.headText}>Tempo</Text>
                <Text style={styles.infoText}>
                  Tempo é dinheiro. Economize tempo utilizando a Hypemax e ganhe
                  um estilo de vida mais próspero e saudável.
                </Text>
              </Card>
              <Card image={require('../../assets/images/net.jpg')}>
                <Text style={styles.headText}>Rede</Text>
                <Text style={styles.infoText}>
                  Saiba o que está rolando em sua área de atuação, indique
                  amigos para trabalhos, interaja!
                </Text>
              </Card>
            </View>
          </View>
          <View style={styles.verContainer}>
            <Text style={styles.verText}>v.{ver}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1,
  },
  topContainer: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
    height: 50,
  },
  logo: {
    height: 80,
    width: 80,
  },
  helpContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
  },
  headText: {
    fontSize: 18,
    color: Colors.mainColor,
    lineHeight: 24,
  },
  verContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    flex: 1,
  },
  verText: {
    fontSize: 10,
    color: Colors.mainColor,
  },
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(HomeScreen);
