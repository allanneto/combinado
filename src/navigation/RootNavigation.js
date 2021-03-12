import React from 'react';
import {connect} from 'react-redux';

import DrawerNav from './DrawerNav';
import DrawerAuthNav from './DrawerAuthNav';
import {currentUser} from '~/services/authApi';

class RootNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    currentUser()
      .then(user => {
        this.setState({user, loaded: true});
      })
      .catch(() => {
        this.setState({user: null, loaded: true});
      });
  }

  render() {
    if (this.state.loaded) {
      if (!this.props.auth.user) {
        return <DrawerAuthNav />;
      } else {
        return <DrawerNav />;
      }
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

export default connect(mapStateToProps)(RootNavigation);
