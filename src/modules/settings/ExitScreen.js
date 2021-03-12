import React from 'react';
import {connect} from 'react-redux';

import {bindActionCreators} from 'redux';
import {Creators as authActions} from '~/redux/ducks/auth';
import {Creators as searchActions} from '~/redux/ducks/search';

class ExitScreen extends React.Component {
  componentDidMount() {
    this.props.authActions.signOut();
    this.props.searchActions.resetJobSearch();
    this.props.searchActions.resetUserSearch();
  }

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    ...state,
  };
};

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(authActions, dispatch);

const mapDispatchToProps = dispatch => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExitScreen);
