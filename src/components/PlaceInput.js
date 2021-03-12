import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Image,
} from 'react-native';
import _ from 'lodash';
import Colors from '~/config/Colors';

import {getAutoComplete, getPoint} from '~/services/coordApi';

export default class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictions: [],
      ro: props.ro,
      destinationInput: this.props.local || '',
    };
    // this.getPlaces = this.getPlaces.bind(this)
    this.getPlacesDebounced = _.debounce(this.getPlaces, 800);
    // this.setDestination = this.setDestination.bind(this)
  }

  async getPlaces(input) {
    const {lat, lng} = this.props;
    const result = await getAutoComplete(input, lat, lng);
    this.setState({predictions: result.data.predictions});
  }

  setDestination(detail, placeId) {
    Keyboard.dismiss();
    const text = `${detail.main_text}\n${detail.secondary_text}`;
    getPoint(placeId).then(place => {
      this.setState({
        destinationInput: text,
        place: place,
        predictions: [],
        ro: true,
      });
      this.props.set(text, place);
    });
  }

  render() {
    const {suggestionStyle, mainTextStyle, secondaryTextStyle} = styles;
    const predictions = this.state.predictions.map(prediction => {
      return (
        <TouchableOpacity
          key={prediction.id}
          onPress={() =>
            this.setDestination(
              prediction.structured_formatting,
              prediction.place_id,
            )
          }>
          <View style={suggestionStyle}>
            <Text style={mainTextStyle}>
              {prediction.structured_formatting.main_text}
            </Text>
            <Text style={secondaryTextStyle}>
              {prediction.structured_formatting.secondary_text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View>
        <TextInput
          value={this.state.destinationInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          multiline
          numberOfLines={2}
          textAlignVertical="top"
          editable={!this.state.ro}
          onChangeText={input => {
            this.setState({destinationInput: input});
            this.getPlacesDebounced(input);
          }}
          style={
            Platform.OS === 'ios'
              ? styles.placeInputStyleIos
              : styles.placeInputStyle
          }
          placeholder="Qual o local?"
        />
        {Platform.OS === 'ios' && (
          <View style={styles.ios}>
            <Image
              source={require('~/assets/images/powered_by_google_on_white.png')}
            />
          </View>
        )}
        {predictions}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeInputStyleIos: {
    height: 80,
    padding: 8,
    backgroundColor: 'white',
  },
  placeInputStyle: {
    height: 80,
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
    backgroundColor: 'white',
  },
  ios: {
    padding: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.lightColor,
    backgroundColor: 'white',
  },
  secondaryTextStyle: {
    color: Colors.lightColor,
  },
  mainTextStyle: {
    color: 'black',
  },
  suggestionStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightFG,
    backgroundColor: 'white',
    padding: 12,
  },
});
