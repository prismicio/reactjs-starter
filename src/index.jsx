import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import Prismic from 'prismic.io';
import PrismicToolbar from 'prismic-toolbar';
import Help from './Help';

// Update these 2 constants to point to your repository
const endpoint = 'http://toto.wroom.dev/api';
const accessToken = null;

//validate onboarding
const repoEndpoint = endpoint.replace("/api", "");
fetch(repoEndpoint + '/app/settings/onboarding/run', {credentials: 'include', method: 'POST'})
.catch(e => console.log("Cannot access your repository, check your api endpoint"));


// Also change the linkResolver if you change the URL scheme in the Router below
function linkResolver(doc) {
  return '/' + doc.type + '/' + doc.id;
}

function buildContext() {
  return Prismic.api(endpoint).then((api) => {
    return {api, endpoint, accessToken, linkResolver};
  });
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ctx: null };
  }

  componentWillMount() {
    const destination = this.props.children.props.route;
    this.setState({withPrismic: destination.withPrismic, customProps: destination.customProps})
    if(destination.withPrismic) {
      buildContext()
      .then((ctx) => {
        this.setState({ctx});
      })
      .catch((e) => {
        console.error("Cannot contact the API, check your prismic configuration");
      });
    }
  }

  renderEmpty() {
    return <div></div>
  }

  renderWithContext() {
    let myProps = this.state.customProps || {};
    myProps.ctx = this.state.ctx;
    return (
      <div>
        {React.cloneElement(this.props.children, myProps)}
      </div>
    );
  }

  renderComponent() {
    return (
      <div>
        {React.cloneElement(this.props.children, this.state.customProps || {})}
      </div>
    );
  }

  render() {
    if(this.state.withPrismic && !this.state.ctx) return this.renderEmpty()
    else if(this.state.withPrismic && this.state.ctx) return this.renderWithContext()
    else return this.renderComponent()
  }
}

const PREVIEW_EXPIRES: number = 30*60*1000; // 30 minutes

class Preview extends React.Component {
  setRef(token) {
    document.cookie = `${Prismic.previewCookie}=${token}; expires=${PREVIEW_EXPIRES}`;
  }

  componentDidMount() {
    const token = this.props.location.query['token'];
    const url = this.props.ctx.api.previewSession(token, linkResolver, '/');
    this.setRef(token);
    PrismicToolbar.toolbar();
    browserHistory.push(url);
    return url;
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
      <Route path="/preview" component={Preview}/>
      <Route path="/help" component={Help} customProps={{endpoint: endpoint}} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.querySelector('#myApp'));
