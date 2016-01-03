'use strict';

import React from 'react';
import { Prismic } from 'prismic.io';
import { prismicApi, prismicQuery } from './prismic-es6';

const { PureRenderMixin } = React;
const { Predicates } = Prismic;

export default React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    params: React.PropTypes.object.isRequired,
    linkResolver: React.PropTypes.func.isRequired,
    endpoint: React.PropTypes.string.isRequired,
    accesstoken: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      notFound: false,
      doc: null
    };
  },

  componentDidMount: function() {
    prismicApi(this.props.endpoint, this.props.accessToken).then(api => {
      return prismicQuery(api, Predicates.at('document.id', this.props.params.id));
    }).then(res => {
      if (res.results.length > 0) {
        this.setState({doc: res.results[0]});
      } else {
        this.setState({notFound: true});
      }
    });
  },

  render: function() {
    if (this.state.notFound) {
      return (<div>Document not found</div>);
    } else if (!this.state.doc) {
      return (<div>Loading...</div>);
    } else {
      return (
        <div dangerouslySetInnerHTML={{__html: this.state.doc.asHtml(this.props.linkResolver)}} />
      );
    }
  }

});
