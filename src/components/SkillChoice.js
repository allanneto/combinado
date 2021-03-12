import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, ScrollView} from 'react-native';
import Colors from '~/config/Colors';
import {ListItem} from 'react-native-elements';
import {listSkills} from '~/services/eventsApi';

export default class SkillChoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      skills: [],
      check: props.check || '',
      setChoice: props.setChoice,
      tsks: props.tsks ? props.tsks.map(t => t.key) : [],
    };
  }

  componentDidMount() {
    listSkills().then(rec => {
      skills = rec.map(skl => ({
        key: skl.key,
        pic: skl.pic,
      }));
      this.setState({
        skills: skills.filter(r => this.state.tsks.indexOf(r['key']) === -1),
        loaded: true,
      });
    });
  }

  chooseItem = item => {
    this.setState({check: item});
    if (this.state.setChoice) {
      this.state.setChoice(item);
    }
  };

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <View style={styles.container}>
        <View style={styles.listStyle}>
          <View style={styles.sepStyle}>
            <Text style={styles.sectionText}>Selecione uma especialidades</Text>
          </View>
          <ScrollView>
            {this.state.skills.map(p => (
              <ListItem
                bottomDivider
                leftAvatar={
                  p.pic ? (
                    <Image
                      source={{uri: p.pic}}
                      style={{width: 20, height: 20}}
                    />
                  ) : null
                }
                title={p.key}
                titleStyle={
                  this.state.check === p.key ? styles.title2 : styles.title1
                }
                key={p.key}
                onPress={() => this.chooseItem(p.key)}
                checkmark={this.state.check === p.key}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listStyle: {
    backgroundColor: Colors.white,
  },
  title1: {
    color: Colors.lightColor,
  },
  title2: {
    color: Colors.bluish,
    fontWeight: 'bold',
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
  cmdContainer: {
    alignItems: 'center',
    padding: 12,
  },
  buttonStyle: {
    backgroundColor: Colors.lightColor,
    borderColor: Colors.lightColor,
    borderWidth: 1,
    borderRadius: 4,
  },
});
