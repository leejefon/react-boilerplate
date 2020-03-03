import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  debugMode: false
});

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_DEBUG_MODE':
      return state.merge({
        debugMode: action.data
      });
    default:
      return state;
  }
}

export default uiReducer;
