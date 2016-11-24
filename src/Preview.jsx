import React from 'react';

import { browserHistory } from 'react-router';
import PrismicToolbar from 'prismic-toolbar';
import Cookies from 'js-cookie';
import Prismic from 'prismic.io';
import Config from '../prismic-configuration';

const PREVIEW_EXPIRES = 30 * 60 * 1000; // 30 minutes

export default class Preview extends React.Component {

  componentDidMount() {
    const token = this.props.location.query.token;
    const url = this.props.ctx.api.previewSession(token, Config.linkResolver, '/');
    Cookies.set(Prismic.previewCookie, token, { expires: PREVIEW_EXPIRES });
    PrismicToolbar.toolbar();
    browserHistory.push(url);
    return url;
  }

  render() {
    return <p>Loading previews...</p>;
  }
}
