import React from 'react';

import { browserHistory } from 'react-router';
import PrismicToolbar from 'prismic-toolbar';
import Prismic from 'prismic.io';
import Config from '../prismic-configuration';

const PREVIEW_EXPIRES = 30 * 60 * 1000; // 30 minutes

export default class Preview extends React.Component {

  static setRef(token) {
    document.cookie = `${Prismic.previewCookie}=${token}; expires=${PREVIEW_EXPIRES}`;
  }

  componentDidMount() {
    const token = this.props.location.query.token;
    const url = this.props.ctx.api.previewSession(token, Config.linkResolver, '/');
    Preview.setRef(token);
    PrismicToolbar.toolbar();
    browserHistory.push(url);
    return url;
  }

  render() {
    return <p>Loading previews...</p>;
  }
}
