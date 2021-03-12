/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Alert, ScrollView, Dimensions} from 'react-native';
import {FAB} from 'react-native-paper';
import {ListItem} from 'react-native-elements';

import Colors from '~/config/Colors';
import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {readUser} from '~/services/usersApi';

const ww = Dimensions.get('window').width;

class PersonLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      user: null,
      lnks: [],
    };
  }

  componentDidMount() {
    readUser(this.props.auth.user.ema).then(user => {
      this.setState({user: user, lnks: user.lnks || []});
    });
  }

  static navigationOptions = {
    title: 'Links',
    headerStyle: {
      backgroundColor: Colors.mainColor,
    },
    headerTintColor: Colors.white,
  };

  refresh = lnks => {
    this.setState({lnks: lnks});
  };

  viewItem(url = null) {
    this.props.navigation.navigate('PersonLinksView', {
      url: url,
      refresh: this.refresh,
    });
  }

  render() {
    if (this.state.error !== null) {
      Alert.alert('Erro', this.state.error);
    }
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <ScrollView>
            {this.state.lnks.map(lin => (
              <ListItem
                leftIcon={{
                  name: 'share',
                  type: 'material-community',
                  color: Colors.lightColor,
                }}
                key={lin[0]}
                bottomDivider
                chevron
                subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
                title={lin[1]}
                subtitle={lin[0]}
                onPress={() => this.viewItem(lin[0])}
              />
            ))}
          </ScrollView>
          <FAB style={styles.fab} icon="plus" onPress={() => this.viewItem()} />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainers: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 1,
    marginLeft: 1,
  },
  img: {
    width: (ww - 3) / 2,
    height: (ww - 3) / 2,
    marginRight: 1,
    marginBottom: 1,
  },
  fab: {
    position: 'absolute',
    backgroundColor: Colors.secColor,
    margin: 0,
    right: 20,
    bottom: 20,
  },
  cmdContainer: {
    marginTop: 20,
    flexDirection: 'row',
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
)(PersonLinks);
