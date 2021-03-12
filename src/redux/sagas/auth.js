import {call, put} from 'redux-saga/effects';

import {currentSession} from '../../services/authApi';
import {Creators as AuthActions} from '../ducks/auth';

export function* setSession(action) {
  try {
    const {user} = yield call(currentSession);
    yield put(AuthActions.setSessionSuccess(user));
  } catch (error) {
    console.log(error);
  }
}
