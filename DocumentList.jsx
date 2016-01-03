"use strict";

import React from 'react';
import { Link } from 'react-router';
import { Prismic } from 'prismic.io';

const { PureRenderMixin } = React;

export const DocumentList = (props) => (
  <ul>
    {props.docs.map((doc, i) => {
       return (<li key={doc.id}>
         <Link to={props.linkResolver(doc)}>{doc.slug}</Link>
       </li>);
     })}
  </ul>
);
DocumentList.propTypes = {
  docs: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Prismic.Document)).isRequired,
  linkResolver: React.PropTypes.func.isRequired
};

export const DocumentListContainer = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    api: React.PropTypes.instanceOf(Prismic.Api),
    endpoint: React.PropTypes.string.isRequired,
    accesstoken: React.PropTypes.string,
    linkResolver: React.PropTypes.func.isRequired,
    q: React.PropTypes.string // Prismic query
  },
  getInitialState: function() {
    return {
      docs: []
    };
  },
  componentDidMount: function() {
    this.props.api.form("everything").ref(this.props.api.master()).submit((err, res) => {
      this.setState({docs: res.results});
    });
  },
  render: function() {
    return <DocumentList endpoint={this.props.endpoint} docs={this.state.docs} linkResolver={this.props.linkResolver} />;
  }
});
