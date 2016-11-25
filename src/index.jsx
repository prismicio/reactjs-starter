import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';

import NotFound from './404.jsx';
import App from './App.jsx';
import Help from './Help.jsx';
import Preview from './Preview.jsx';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/help" />
      <Route path="/preview" component={Preview} withPrismic />
      <Route path="/help" component={Help} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
), document.querySelector('#myApp'));
