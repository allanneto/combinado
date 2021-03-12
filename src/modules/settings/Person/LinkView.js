/* eslint-disable react/jsx-pascal-case */
import React from 'react'
import { connect } from 'react-redux'

import Colors from '~/config/Colors'
import { bindActionCreators } from 'redux'
import { Creators as authActions } from '~/redux/ducks/auth'
import { WebView } from 'react-native-webview'
import { Text } from 'react-native'

class LinkView extends React.Component {
  constructor (props) {
    super(props)
    const { params } = this.props.navigation.state

    this.state = {
      ok: false,
      error: null,
      url: params.url,
      user: null
    }
  }

  static navigationOptions = {
    title: 'Pagina externa',
    headerStyle: {
      backgroundColor: Colors.mainColor
    },
    headerTintColor: Colors.white
  }

  componentDidMount () {
    this.setState({ ok: true })
  }

  render () {
    if (!this.state.ok) {
      return null
    }
    return (
      <WebView
        source={{ uri: this.state.url }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}
const mapDispatchToProps = dispatch => bindActionCreators(authActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkView)
