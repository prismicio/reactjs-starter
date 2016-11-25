import React from 'react';

import { browserHistory } from 'react-router';
import Cookies from 'js-cookie';
import Prismic from 'prismic.io';
import PrismicToolbar from 'prismic-toolbar';
import PrismicConfig from '../prismic-configuration';

const PREVIEW_EXPIRES = 30 * 60 * 1000; // 30 minutes

export default class Preview extends React.Component {

  componentDidMount() {
    const token = this.props.location.query.token;
    const url = this.props.prismicCtx.api.previewSession(token, PrismicConfig.linkResolver, '/');
    Cookies.set(Prismic.previewCookie, token, { expires: PREVIEW_EXPIRES });
    PrismicToolbar.toolbar();
    browserHistory.push(url);
    return url;
  }

  render() {
    return <p>Loading previews...</p>;
  }
}
