import React from 'react';
import ReactDOM from 'react-dom';

import PrismicToolbar from 'prismic-toolbar';

const PREVIEW_EXPIRES = 30*60*1000; // 30 minutes

export default class Preview extends React.Component {
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
