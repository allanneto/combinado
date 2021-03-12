/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

import {Button} from 'react-native-paper';

import Colors from '~/config/Colors';

import {Creators as searchActions} from '~/redux/ducks/search';
import {bindActionCreators} from 'redux';
import {listSkills} from '~/services/eventsApi';

import SkillChoice from '~/components/SkillChoice';

class JobSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    // this.resetSearch();
    listSkills().then(rec => {
      skills = rec.map(skl => ({
        key: skl.key,
        text: skl.key,
      }));
      this.setState({
        skills,
        loaded: true,
      });
    });
  }

  static navigationOptions = () => {
    return {
      title: 'Buscar vagas',
      headerStyle: {
        backgroundColor: Colors.mainColor,
      },
      headerTintColor: Colors.white,
    };
  };

  searchJobs = () => {
    this.props.navigation.state.params.onNavigateBack();
    this.props.navigation.goBack();
  };

  resetSearch = () => {
    this.props.resetJobSearch();
    this.props.navigation.state.params.onNavigateBack();
    this.props.navigation.goBack();
  };

  setChoice = item => {
    this.props.addJobSearch(item);
  };

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <SkillChoice
            check={this.props.search.job}
            setChoice={this.setChoice}
          />

          <View
            style={{
              height: 60,
              borderTopColor: 'silver',
              borderTopWidth: 1,
            }}>
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                icon="refresh"
                onPress={() => this.resetSearch()}>
                Todas
              </Button>
              <Button
                mode="contained"
                icon="magnify"
                onPress={() => this.searchJobs()}>
                Pesquisar
              </Button>
            </View>
          </View>

          {/* <ScrollView>
            <View style={styles.card}>
              <View style={styles.subContainer}>
                <View style={styles.listFlags}>
                  {this.state.skills.map(item => (
                    <FeatBadge
                      filter={this.setFilter}
                      selected={this.isSelected('skl', item.key)}
                      title={item.key}
                      feat="skl"
                      value={item.key}
                      key={item.key}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView> */}
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
  },
  card: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 1,
  },
  subheader: {
    padding: 12,
    backgroundColor: Colors.secColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'silver',
  },
  title: {
    fontSize: 15,
    color: Colors.mainColor,
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.lightColor,
    marginLeft: 20,
  },
  subItem: {
    margin: 8,
    flex: 1,
    marginTop: 5,
  },
  subContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  listFlags: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rangeFlag: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoTypeLabel: {
    fontSize: 14,
    textAlign: 'right',
    color: Colors.secColor,
    fontFamily: 'regular',
    paddingBottom: 10,
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(searchActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(JobSearch);
