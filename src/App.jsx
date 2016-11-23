import React from 'react';
import ReactDOM from 'react-dom';

import Prismic from 'prismic.io';
import configuration from '../prismic-configuration';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ctx: null };
  }

  componentWillMount() {
    this.validateOnboarding()

    const destination = this.props.children.props.route;
    this.setState({withPrismic: destination.withPrismic, customProps: destination.customProps})
    if(destination.withPrismic) {
      this.buildContext()
      .then((ctx) => {
        this.setState({ctx});
      })
      .catch((e) => {
        console.error("Cannot contact the API, check your prismic configuration");
      });
    }
  }

  buildContext() {
    return Prismic.api(configuration.apiEndpoint).then((api) => {
      return {api, endpoint: configuration.apiEndpoint, accessToken, linkResolver: configuration.linkResolver};
    });
  }

  validateOnboarding() {
    //validate onboarding
    const repoEndpoint = configuration.apiEndpoint.replace("/api", "");
    fetch(repoEndpoint + '/app/settings/onboarding/run', {credentials: 'include', method: 'POST'})
    .catch(e => console.log("Cannot access your repository, check your api endpoint"));
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
