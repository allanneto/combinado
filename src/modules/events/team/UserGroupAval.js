/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {ListItem, AirbnbRating} from 'react-native-elements';
import {Button, Text} from 'react-native-paper';
import Colors from '../../../config/Colors';
import {eventGroupAval} from '~/services/eventsApi';

class UserGroupAval extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loading: false,
      user: null,
      image: null,
    };
  }

  async componentDidMount() {
    const {event, onNavigateBack} = this.props.navigation.state.params;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      loaded: true,
      event,
      onNavigateBack,
      avl: 0,
    });
  }

  static navigationOptions = {
    title: 'Avaliação em grupo',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  updateRating = async () => {
    this.setState({loading: true});
    const data = {
      ema: this.state.event.ema,
      dat: this.state.event.dat,
      aval: this.state.avl,
    };
    try {
      await eventGroupAval(data);
      this.setState({loading: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({loading: false});
      Alert.alert('Erro', err.message);
    }
  };

  ratingCompleted = rating => {
    this.setState({avl: rating});
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
            <ListItem
              bottomDivider
              subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
              leftIcon={{
                name: 'group',
                type: 'material',
                color: Colors.lightColor,
              }}
              title={'Avaliar todos os não avaliados'}
              subtitle={'Em todas as especialidades'}
            />

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                paddingTop: 8,
                paddingBottom: 4,
                backgroundColor: Colors.white,
              }}>
              <Text style={styles.avalLabel}>{this.state.avl}</Text>
              <Text style={styles.avalMax}> / 5</Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4,
                backgroundColor: Colors.white,
              }}>
              <AirbnbRating
                showRating={false}
                onFinishRating={this.ratingCompleted}
                defaultRating={this.state.avl}
              />
            </View>
          </ScrollView>
          {this.state.avl ? (
            <View style={styles.cmdBar}>
              <Button
                compact
                uppercase={false}
                icon="star"
                mode="contained"
                color={Colors.secColor}
                onPress={this.updateRating}
                loading={this.state.loading}>
                Confirmar avaliação
              </Button>
            </View>
          ) : null}
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
  cmdBar: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightFG,
    justifyContent: 'space-around',
  },
  avalLabel: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  avalMax: {
    fontSize: 20,
    color: Colors.lightFG,
  },
  infoAnswerLabel: {
    fontSize: 14,
    color: Colors.lightColor,
    paddingBottom: 10,
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
});

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(UserGroupAval);
