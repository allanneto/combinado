import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'

import { bindActionCreators } from 'redux'
import { Creators as regActions } from '~/redux/ducks/reg'
import Colors from '~/config/Colors'
import { getStatusBarHeight } from '~/services/getStatusBarHeight'
import { language } from '~/locales/format'
import { WebView } from 'react-native-webview'

class WebPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Achem-me',
      headerStyle: {
        backgroundColor: Colors.mainColor,
        borderBottomColor: Colors.mainColor,
        marginTop: getStatusBarHeight()
      },
      headerTintColor: Colors.white,
      headerLeft: (
        <View style={{ marginLeft: 8 }}>
          <Icon
            name='chevron-left'
            color={Colors.white}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 8 }}>
          <Icon
            name='menu'
            color={Colors.white}
            onPress={() => navigation.toggleDrawer()}
          />
        </View>
      )
    }
  }

  render () {
    return (
      <WebView
        source={{ uri: 'http://achem.gapfranco.com' }}
        style={{ marginTop: 20 }}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(regActions, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebPage)
