import React from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';

import {connect} from 'react-redux';
import Accordion from 'react-native-collapsible/Accordion';

import Colors from '~/config/Colors';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';

const SECTIONS = [
  {
    title: '1. Onde está o código de verificação enviado pelo app?',
    content: [
      'Ao criar uma conta ou solicitar uma nova senha, você receberá um E-Mail com o "código de verificação".',
    ],
  },
  {
    title: '2. Como faça a atualização dos meus dados cadastrais?',
    content: [
      'Depois que você conectou no CombinadoApp com sua conta de usuário, clique no "menu" que esta no canto superior direito, ',
      'será exibido o menu, então clique na primeira opção "Meu Perfil". ',
      'Você deve preencher todos os dados obrigatórios, se for um freelancer informar suas especialidades ',
      'e seus dados de conta bancária para depósito dos seus pagamentos.',
    ],
  },
  {
    title: '3. Sou freelancer. Como informo minhas especialidades de trabalho?',
    content: [
      'Depois que você conectou no CombinadoApp com sua conta de usuário, clique no "menu" que esta no canto superior direito, ',
      'será exibido o menu, role a tela para baixo até a opção "Quero trabalhar" e clique na opção "Minhas especialidades". ',
      'Preencha até 5 (cinco) especialidades que você tem experiência de trabalho.',
    ],
  },
  {
    title: '4. Quanto eu pago para usar o aplicativo CombinadoApp?',
    content: [
      'Se você for um "Contratante" não pagará nada para publicar a vaga de freelancer no aplicativo CombinadoApp, ',
      'apenas pagará pelo serviço do profissional freelancer em "dinheiro" ou "cartão" pelo aplicativo. ',
      'Se você for um "freelancer", cobramos 15% (quinze por cento) do valor do trabalho que você for contratado para realizar.',
    ],
  },
  {
    title:
      '5. Sou freelancer. Como recebo pelos trabalhos realizados com o aplicativo CombinadoApp?',
    content: [
      'Nesse momento você receberá diretamente do contratante em dinheiro. Em breve teremos a opção de pagamento online.',
    ],
  },
  {
    title:
      '6. Sou freelancer e gostaria de saber se posso trabalhar em mais de um evento por dia',
    content: [
      'Sim, poderá, desde que seja em um intervalo de uma hora entre um trabalho de outro e não seja o mesmo contratante.',
    ],
  },
  {
    title: '7. Como é definida a nota de avaliação do freelancer? ',
    content: [
      'A nota de avaliação do Freelancer é uma média das notas atributadas pelos contratantes, incluindo "faltas" ',
      'sendo contado como trabalho realizado porem atribuído NOTA 0 (zero).',
    ],
  },
  {
    title: '8. Como faço para cancelar uma vaga publicada? ',
    content: [
      'Você pode clicar em cima da vaga e visualizar os detalhes. Logo abaixo verá um botão para cancelar.',
    ],
  },
  {
    title:
      '9. Como faço para incluir mais vagas dentro de uma especialidade já publicada? ',
    content: [
      'Você pode clicar em cima do evento e visualizar os detalhes. Depois, clicar em cima da vaga para uma ',
      'nova especialidade ou novas vagas.',
    ],
  },
  {
    title: '10. O que acontece se eu cancelar as vagas publicadas? ',
    content: [
      'Todos os prestadores já incluídos serão notificados e suas agendas liberadas. Mas não se esqueça que sua ',
      'pontuação será alterada.',
    ],
  },
];

class FAQScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Perguntas frequentes',
      headerStyle: {
        backgroundColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
    };
  };

  state = {
    activeSections: [],
  };

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text style={styles.contentText}>{section.content}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Accordion
            sections={SECTIONS}
            activeSections={this.state.activeSections}
            // renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 10,
    borderTopColor: Colors.lightFG,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    padding: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  contentText: {
    fontSize: 14,
    // fontWeight: '500'
  },
  content: {
    padding: 20,
    backgroundColor: Colors.white,
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
)(FAQScreen);
