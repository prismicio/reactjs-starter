'use strict';

require("./node_modules/bootstrap/dist/css/bootstrap.min.css");

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import { BlogIndex, BlogPost } from './blog';

export class App extends React.Component {
	render() {
		return (
      <h1>Prismic.io + ReactJS</h1>
		);
	}
}

function NoMatch(props) {
  return <h1>Not found</h1>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="blog" component={BlogIndex}>
        <Route path="/blog/:uid" component={BlogPost}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector("#myApp"));

