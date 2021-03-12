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

import {ListItem, AirbnbRating, Rating} from 'react-native-elements';
import {Button, Text, TextInput} from 'react-native-paper';
import {getImageUrl} from '~/services/s3Api';
import Colors from '../../../config/Colors';
import {getSkillName} from '~/services/eventsApi';
import {updateWork} from '~/services/worksApi';

class UserAval extends React.Component {
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
    const {item, ro, onNavigateBack} = this.props.navigation.state.params;
    getImageUrl(item.pic).then(image => {
      this.setState({
        loaded: true,
        image,
        item,
        onNavigateBack,
        ro,
        alt: false,
        avl: item.avl || 0,
        obs: item.obs || '',
        aus: item.aus || false,
        pre: item.pre || false,
      });
    });
  }

  static navigationOptions = {
    title: 'Avaliação do trabalho',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  updateRating = async () => {
    this.setState({loading: true});
    const data = {
      ...this.state.item,
      avl: this.state.avl,
      obs: this.state.obs,
      aus: this.state.aus,
      pre: this.state.pre,
    };
    try {
      await updateWork(data);
      this.setState({loading: false, alt: false});
      this.state.onNavigateBack();
      this.props.navigation.goBack();
    } catch (err) {
      this.setState({loading: false, alt: false});
      Alert.alert('Erro', err.message);
    }
  };

  ratingCompleted = rating => {
    this.setState({avl: rating, alt: true});
  };

  changeObs = obs => {
    this.setState({
      obs,
      alt: true,
    });
  };

  changeAus = () => {
    if (this.state.aus) {
      this.setState({aus: false, alt: true});
    } else {
      this.setState({avl: 0, aus: true, pre: false, alt: true});
    }
  };

  changePre = () => {
    if (this.state.pre) {
      this.setState({pre: false, avl: 0, alt: true});
    } else {
      this.setState({avl: 0, pre: true, aus: false, alt: true});
    }
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <ScrollView style={{flex: 1, backgroundColor: Colors.white}}>
            <ListItem
              bottomDivider
              subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
              title={'Evento'}
              subtitle={this.state.item.tit}
            />
            <ListItem
              bottomDivider
              subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
              leftAvatar={{
                source: {uri: this.state.pip},
                rounded: true,
              }}
              title={this.state.item.nop}
              subtitle={getSkillName(this.state.item.tsk)}
            />
            {this.state.pre && (
              <>
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
                  {this.state.ro ? (
                    <Rating
                      readonly
                      showRating={false}
                      startingValue={this.state.avl || 0}
                      imageSize={20}
                    />
                  ) : (
                    <AirbnbRating
                      showRating={false}
                      onFinishRating={this.ratingCompleted}
                      defaultRating={this.state.avl}
                    />
                  )}
                </View>
              </>
            )}
            <ListItem
              bottomDivider
              title={'Prestador compareceu ao trabalho'}
              switch={{
                value: this.state.pre,
                disabled: this.state.ro,
                onValueChange: () => this.changePre(),
              }}
            />
            <ListItem
              bottomDivider
              title={'Prestador faltou ao trabalho'}
              switch={{
                value: this.state.aus,
                disabled: this.state.ro,
                onValueChange: () => this.changeAus(),
              }}
            />

            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                marginTop: 8,
                marginHorizontal: 8,
              }}>
              <TextInput
                label="Observações"
                multiline
                mode="outlined"
                editable={!this.state.ro}
                value={this.state.obs}
                onChangeText={text => this.changeObs(text)}
              />
            </View>
          </ScrollView>
          {this.state.alt && !this.state.ro ? (
            <View style={styles.cmdBar}>
              <Button
                compact
                uppercase={false}
                icon="star"
                mode="contained"
                color={Colors.secColor}
                onPress={this.updateRating}
                loading={this.state.loading}>
                Confirmar
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

export default connect(mapStateToProps)(UserAval);
