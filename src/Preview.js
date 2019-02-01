import React from 'react';
import qs from 'qs';
import PrismicConfig from './prismic-configuration';

export default class Preview extends React.Component {
  componentDidUpdate() {
    if(this.props.prismicCtx) {
      const params = qs.parse(this.props.location.search.slice(1));
      this.props.prismicCtx.api.previewSession(params.token, PrismicConfig.linkResolver, '/').then((url) => {
        this.props.history.push(url);
      });
    }
  }

  render() {
    return <p>Loading previews...</p>;
  }
}
