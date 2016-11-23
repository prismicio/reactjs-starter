import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import configuration from '../prismic-configuration';

import App from './App.jsx';
import Help from './Help.jsx';
import Preview from './Preview.jsx';

function NoMatch(props) {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/help" />
      <Route path="/preview" component={Preview}/>
      <Route path="/help" component={Help} customProps={{endpoint: configuration.apiEndpoint}} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector('#myApp'));
