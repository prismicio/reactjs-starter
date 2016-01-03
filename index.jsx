'use strict';

require("./node_modules/bootstrap/dist/css/bootstrap.min.css");

import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { prismicApi } from './prismic-es6';
import { DocumentListContainer } from './DocumentList';
import Doc from './Doc';

// Update these 2 constants to point to your repository
const endpoint = "https://blogtemplate.prismic.io/api";
const accessToken = null;

// Also change the linkResolver if you change the URL scheme in the Router below
function linkResolver(doc) {
  return '/' + doc.type + '/' + doc.id;
}

export class App extends React.Component {
	render() {
		return (
      <div>
        <h1>Prismic.io + ReactJS</h1>
        {this.props.children}
      </div>
		);
	}
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }
  componentDidMount() {
    prismicApi(endpoint).then((api) => this.setState({api: api}));
  }
  render() {
    if (!this.state.api) {
      return (<div>Loading...</div>);
    }
    return (<DocumentListContainer
                api={this.state.api}
                endpoint={endpoint}
                accesstoken={accessToken}
                linkResolver={linkResolver}
            />);
  }
}

function DocWrapper(props) {
  return <Doc params={props.params} endpoint={endpoint} accesstoken={accessToken} linkResolver={linkResolver} />;
}

function NoMatch(props) {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path=":type/:id" component={DocWrapper}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector("#myApp"));

