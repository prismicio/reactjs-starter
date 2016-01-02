'use strict';

require("./node_modules/bootstrap/dist/css/bootstrap.min.css");

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { Prismic } from 'prismic.io';
import { DocumentListContainer } from './DocumentList';

const endpoint = "https://blogtemplate.prismic.io/api";
const accessToken = null;

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

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      doc: null
    };
  }
  componentDidMount() {
    Prismic.Api(endpoint, ((err, api) => {
      api.form("everything").ref(api.master()).query(Prismic.Predicates.at('document.id', this.props.params.id)).submit((err, res) => {
        if (res.results.length > 0) {
          this.setState({doc: res.results[0]});
        } else {
          this.setState({notFound: true});
        }
        this.setState({doc: res.results});
      });
    }), this.props.accessToken);
  }

  render() {
    if (this.state.notFound) {
      return (<div>Document not found</div>);
    } else if (!this.state.doc) {
      return (<div>Loading...</div>);
    } else {
      return (
        <div dangerouslySetInnerHTML={{__html: this.state.doc.asHtml(linkResolver)}} />
      );
    }
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { api: null };
  }
  componentDidMount() {
    Prismic.Api(endpoint, ((err, api) => {
      this.setState({api: api});
    }));
  }
  render() {
    if (!this.state.api) {
      return (<div>Loading...</div>);
    }
    return (<DocumentListContainer
                api={this.state.api}
                linkResolver={linkResolver}
            />);
  }
}

function NoMatch(props) {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path=":type/:id" component={Doc}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector("#myApp"));

