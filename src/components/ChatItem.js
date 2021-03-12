import React, {Component} from 'react';
import {Image} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import {listSkills} from '~/services/eventsApi';
import {readUser} from '~/services/usersApi';

import Colors from '~/config/Colors';

class ChatItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    const dta = this.props.item.msgId.split('#')[1];
    const abr = this.props.item.msgId.split('#')[2];
    let ico = '';
    let job = '';
    let usr = '';
    let source = {};
    listSkills().then(async rec => {
      skills = rec.map(skl => ({
        key: skl.key,
        pic: skl.pic,
      }));
      if (abr === 'A') {
        ico = {name: 'forum'};
      } else if (abr === 'J') {
        job = this.props.item.msgId.split('#')[3];
        sk = skills.find(s => s.key === job);
        source = {uri: sk.pic};
      } else if (abr === 'U') {
        usr = this.props.item.msgId.split('#')[3];
        const user = await readUser(usr);
        source = {uri: user.pic};
      }
      let leftAvatar = {};
      if (ico) {
        leftAvatar = {
          icon: ico,
        };
      } else {
        leftAvatar = (
          <Image
            source={source}
            style={{width: 32, height: 32, borderRadius: 16}}
          />
        );
      }
      this.setState({loaded: true, dta, leftAvatar, abr});
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }
    return (
      <ListItem
        title={this.props.item.tit}
        subtitle={moment(this.state.dta).format('DD/MM/YYYY HH:mm')}
        bottomDivider
        chevron
        subtitleStyle={{color: Colors.mainColor, fontWeight: 'bold'}}
        leftAvatar={this.state.leftAvatar}
        onPress={this.props.onPress}
      />
    );
  }
}

export default ChatItem;
