import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import Prismic from 'prismic.io';
import PrismicToolbar from 'prismic-toolbar';
import DocumentListContainer from './DocumentList';
import Doc from './Doc';
import Help from './Help';

// Update these 2 constants to point to your repository
const endpoint = 'https://your-repo-name.prismic.io/api';
const accessToken = null;

//validate onboarding
const repoEndpoint = endpoint.replace("/api", "");
fetch(repoEndpoint + '/app/settings/onboarding/run', {credentials: 'include', method: 'POST'})
.catch(e => console.log("Cannot access your repository, check your api endpoint"));


// Also change the linkResolver if you change the URL scheme in the Router below
function linkResolver(doc) {
  return '/' + doc.type + '/' + doc.id;
}

export class App extends React.Component {
  render() {
    return (
      <div>
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
    Prismic.api(endpoint).then((api) => this.setState({api}));
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

function HelpWrapper(props) {
  const repoRegexp = new RegExp('^(https?:\/\/([\\-\\w]+)\\.[a-z]+\\.(io|dev))\/api$');
  const match = endpoint.match(repoRegexp);
  const repoURL = match[1];
  const name = match[2];
  const host = window.location.host + "/" + window.location.pathname.split('/')[1];
  var isConfigured = false;
  if ( name !== 'your-repo-name' ) {
    isConfigured = true;
  }
  return <Help isConfigured={isConfigured} repoURL={repoURL} name={name} host={host} />;
}

const PREVIEW_EXPIRES: number = 30*60*1000; // 30 minutes

class Preview extends React.Component {
  setRef(token) {
    document.cookie = `${Prismic.previewCookie}=${token}; expires=${PREVIEW_EXPIRES}`;
  }
  componentDidMount() {
    const token = this.props.location.query['token'];
    Prismic.api(endpoint, {accessToken}).then((api) =>
      api.previewSession(token, linkResolver, '/')
    ).then((url) => {
      this.setRef(token);
      PrismicToolbar.toolbar();
      browserHistory.push(url)
      return url;
    });
  }
  render() {
    return (<p>Loading previews...</p>);
  }
}

Preview.contextTypes = {
  router: React.PropTypes.object
};

function NoMatch(props) {
  return <div>Not found</div>;
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/help" />
      <Route path=":type/:id" component={DocWrapper}/>
      <Route path="/preview" component={Preview}/>
      <Route path="/help" component={HelpWrapper}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector('#myApp'));
