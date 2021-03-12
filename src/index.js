import React from 'react';
import './config/reactotronConfig';
import {StatusBar, StyleSheet, View, YellowBox} from 'react-native';
import {Provider} from 'react-redux';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';

import {PersistGate} from 'redux-persist/integration/react';
// import SplashScreen from 'react-native-splash-screen'

import Amplify from 'aws-amplify';

import RootNavigation from './navigation/RootNavigation';
import Colors from './config/Colors';
import amplifyConfig from './config/amplifyConfig';
// import OneSignal from 'react-native-onesignal'
import storeConfig from './redux/store';
// import { Sentry } from 'react-native-sentry'

const {store, persistor} = storeConfig();
global.Buffer = global.Buffer || require('buffer').Buffer;

// Sentry.config('https://91cc681ed08146119ba4b9b4113e87a1@sentry.io/1471670').install()
Amplify.configure(amplifyConfig);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.mainColor,
    accent: Colors.secColor,
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings([
      'unknown call: "relay:check"',
      'componentWillUpdate has been renamed',
      'componentWillMount has been renamed',
      "The 'titleIOS'",
      'header: null',
      'react-native-modal-datetime-picker',
      'componentWillReceiveProps has been renamed',
    ]);
    // this.state = { state: null, persistes: null, ok: false }
  }

  // componentDidMount () {
  //   SplashScreen.hide()
  // }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <StatusBar translucent barStyle="light-content" />
            <PaperProvider theme={theme}>
              <RootNavigation />
            </PaperProvider>
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainColor,
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default App;
