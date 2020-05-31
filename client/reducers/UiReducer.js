import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  isLoggedIn: false,
  urlBeforeLogin: '/'
});

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      return state.merge({
        isLoggedIn: action.data
      });
    case 'SET_URL_BEFORE_LOGIN':
      return state.merge({
        urlBeforeLogin: action.data
      });
    default:
      return state;
  }
}

export default uiReducer;
