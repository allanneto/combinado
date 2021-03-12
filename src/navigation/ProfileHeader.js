import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {Text, Avatar, Rating} from 'react-native-elements';
import {bindActionCreators} from 'redux';

import {Creators as authActions} from '~/redux/ducks/auth';

class ProfileHeader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {!this.props.auth.user || !this.props.auth.user.pic ? (
            <Avatar
              size="large"
              rounded
              showEditButton
              icon={{name: 'person', type: 'material'}}
              onPress={() => this.props.nav.navigation.navigate('Profile')}
            />
          ) : (
            <Avatar
              size="large"
              rounded
              showEditButton
              editButton={{
                name: 'camera-alt',
                color: 'black',
              }}
              source={{uri: this.props.auth.user.pic}}
              onPress={() => this.props.nav.navigation.navigate('Profile')}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text>{this.props.auth.user ? this.props.auth.user.nom : ''}</Text>
          <Rating
            readonly
            showRating={false}
            startingValue={this.props.auth.user ? this.props.auth.user.avl : 0}
            imageSize={14}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: Colors.white
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    margin: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
)(ProfileHeader);
