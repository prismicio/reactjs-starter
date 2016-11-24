import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import Config from '../prismic-configuration';

import App from './App.jsx';
import Help from './Help.jsx';
import Preview from './Preview.jsx';

function NoMatch() {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/help" />
      <Route path="/preview" component={Preview} withPrismic />
      <Route path="/help" component={Help} customProps={{ endpoint: Config.apiEndpoint }} />
      <Route path="*" component={NoMatch} />
    </Route>
  </Router>
), document.querySelector('#myApp'));
