'use strict';

require("./node_modules/bootstrap/dist/css/bootstrap.min.css");

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import { Prismic } from 'prismic.io';

const endpoint = "https://blogtemplate.prismic.io/api";
const accessToken = null;

function linkResolver() {
  return '';
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

class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: []
    };
  }
  componentDidMount() {
    Prismic.Api(this.props.endpoint, ((err, api) => {
      api.form("everything").ref(api.master()).submit((err, res) => {
        this.setState({docs: res.results});
      });
    }), this.props.accessToken);
  }
  render() {
    return (
      <ul>
      {this.state.docs.map((doc, i) => {
        return (<div key={doc.id}>
        <li><Link to={'/' + doc.type + '/' + doc.id}>{doc.slug}</Link></li>
        </div>);
      })}
      </ul>
    );
  }
}
DocumentList.propTypes = {
  endpoint: React.PropTypes.string.isRequired,
  accessToken: React.PropTypes.string
};

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
        console.log("err ", err);
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
  render() {
    return (<DocumentList endpoint={endpoint} accessToken={accessToken} />);
  }
}

function NoMatch(props) {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path=":type/:id" component={Doc}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector("#myApp"));

