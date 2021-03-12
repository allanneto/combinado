import {all, takeLatest} from 'redux-saga/effects';

import {Types as AuthTypes} from '../ducks/auth';

import {setSession} from './auth';

export default function* rootSaga() {
  yield all([takeLatest(AuthTypes.SET_REQUEST, setSession)]);
}
