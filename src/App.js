import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from 'react-router-dom';
import Preview from './Preview';
import Help from './Help';
import NotFound from './NotFound';
import './App.css';

const App = (props) => (
  <Router>
    <div>
      <Redirect exact from="/" to="/help"/>
      <Route exact path="/help" component={Help} />
      <Route exact path="/preview" render={routeProps => <Preview {...routeProps} prismicCtx={props.prismicCtx} />} />
      <Route component={NotFound} />
    </div>
  </Router>
);

export default App;
