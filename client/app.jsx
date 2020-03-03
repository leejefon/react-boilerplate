import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import reducers from './reducers/Reducers';
import Dashboard from './pages/Dashboard';

import './css/main.scss';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

try {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route render={Dashboard} />
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  );
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e);
}
