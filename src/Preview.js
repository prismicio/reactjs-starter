import React from 'react';

import Cookies from 'js-cookie';
import qs from 'qs';
import Prismic from 'prismic-javascript';
import PrismicConfig from './prismic-configuration';

const PREVIEW_EXPIRES = 1/48; // 30 minutes

export default class Preview extends React.Component {

  componentWillReceiveProps(props) {
    const params = qs.parse(props.location.search.slice(1));
    props.prismicCtx.api.previewSession(params.token, PrismicConfig.linkResolver, '/').then((url) => {
      Cookies.set(Prismic.previewCookie, params.token, { expires: PREVIEW_EXPIRES });
      props.history.push(url);
    });
  }

  render() {
    return <p>Loading previews...</p>;
  }
}
