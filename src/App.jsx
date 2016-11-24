import React from 'react';
import Prismic from 'prismic.io';
import Config from '../prismic-configuration';

export default class App extends React.Component {

  static validateOnboarding() {
    const repoEndpoint = Config.apiEndpoint.replace('/api', '');
    fetch(`${repoEndpoint}/app/settings/onboarding/run`, { credentials: 'include', method: 'POST' })
      .catch(() => console.log('Cannot access your repository, check your api endpoint'));
  }

  static buildContext() {
    const accessToken = Config.accessToken;
    return Prismic.api(Config.apiEndpoint, { accessToken }).then(api => ({
      api,
      endpoint: Config.apiEndpoint,
      accessToken,
      linkResolver: Config.linkResolver,
    }));
  }

  constructor(props) {
    super(props);
    this.state = { ctx: null };
  }

  componentWillMount() {
    App.validateOnboarding();
    if (this.isWithPrismic()) {
      App.buildContext().then((ctx) => {
        this.setState({ ctx });
      }).catch(() => {
        console.error('Cannot contact the API, check your prismic configuration');
      });
    }
  }

  isWithPrismic() {
    return !!this.props.children.props.route.withPrismic;
  }

  render() {
    if (this.isWithPrismic() && !this.state.ctx) {
      return <div>Loading...</div>;
    }

    const props = (this.isWithPrismic && this.state.ctx) ? { ctx: this.state.ctx } : {};

    return (
      <div>
        {React.cloneElement(this.props.children, props)}
      </div>
    );
  }
}
