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

    const destination = this.props.children.props.route;

    this.setState({
      withPrismic: destination.withPrismic,
      customProps: destination.customProps,
    });

    if (destination.withPrismic) {
      App.buildContext().then((ctx) => {
        this.setState({ ctx });
      }).catch(() => {
        console.error('Cannot contact the API, check your prismic configuration');
      });
    }
  }

  renderWithContext() {
    const myProps = this.state.customProps || {};
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
    if (this.state.withPrismic && !this.state.ctx) return <div />;
    else if (this.state.withPrismic && this.state.ctx) return this.renderWithContext();
    return this.renderComponent();
  }
}
