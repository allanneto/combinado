import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-community/async-storage';

import reducers from './ducks';
import sagas from './sagas';

import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage'
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

const middlewares = [];

const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null;

const sagaMiddleware = createSagaMiddleware({sagaMonitor});

middlewares.push(sagaMiddleware);

const composer = __DEV__
  ? compose(
      applyMiddleware(...middlewares),
      console.tron.createEnhancer(),
    )
  : compose(applyMiddleware(...middlewares));

export default () => {
  const store = createStore(persistedReducer, composer);
  sagaMiddleware.run(sagas);
  const persistor = persistStore(store);
  // persistor.purge();
  return {store, persistor};
};
