import {combineReducers} from 'redux';

import auth from './auth';
import reg from './reg';
import search from './search';
import focus from './focus';

export default combineReducers({
  auth,
  reg,
  search,
  focus,
});
