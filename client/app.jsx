import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import reducers from './reducers/Reducers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

import './css/main.scss';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

try {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/resetPassword" component={ResetPassword} />
          <Route exact path="/verifyEmail" component={VerifyEmail} />

          <Route
            render={(state) => {
              const isLoggedIn = store.getState().get('ui').get('isLoggedIn');
              const urlBeforeLogin = state.location.pathname;

              if (!isLoggedIn) {
                store.dispatch({ type: 'SET_URL_BEFORE_LOGIN', data: urlBeforeLogin });
              }

              return isLoggedIn ? (<Dashboard />) : (<Redirect to="/login" />);
            }}
          />
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  );
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}
