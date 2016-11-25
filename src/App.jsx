import React from 'react';
import Prismic from 'prismic.io';
import PrismicConfig from '../prismic-configuration';

export default class App extends React.Component {

  static validateOnboarding() {
    const repoEndpoint = PrismicConfig.apiEndpoint.replace('/api', '');
    fetch(`${repoEndpoint}/app/settings/onboarding/run`, { credentials: 'include', method: 'POST' })
      .catch(() => console.log('Cannot access your repository, check your api endpoint'));
  }

  static buildContext() {
    const accessToken = PrismicConfig.accessToken;
    return Prismic.api(PrismicConfig.apiEndpoint, { accessToken }).then(api => ({
      api,
      endpoint: PrismicConfig.apiEndpoint,
      accessToken,
      linkResolver: PrismicConfig.linkResolver,
    }));
  }

  constructor(props) {
    super(props);
    this.state = { prismicCtx: null };
  }

  componentWillMount() {
    App.validateOnboarding();
    if (this.isWithPrismic()) {
      App.buildContext().then((prismicCtx) => {
        this.setState({ prismicCtx });
      }).catch(() => {
        console.error('Cannot contact the API, check your prismic configuration');
      });
    }
  }

  isWithPrismic() {
    return !!this.props.children.props.route.withPrismic;
  }

  render() {
    if (this.isWithPrismic() && !this.state.prismicCtx) {
      return <div>Loading...</div>;
    }

    const props = (this.isWithPrismic && this.state.prismicCtx)
          ? { prismicCtx: this.state.prismicCtx }
          : {};

    return (
      <div>
        {React.cloneElement(this.props.children, props)}
      </div>
    );
  }
}
