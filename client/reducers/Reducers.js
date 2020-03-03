import { combineReducers } from 'redux-immutable';
import data from './DataReducer';
import ui from './UiReducer';

export default combineReducers({
  data,
  ui
});
