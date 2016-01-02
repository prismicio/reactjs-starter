"use strict";

import React from 'react';
import { Link } from 'react-router';

export var DocumentList = (props) => (
  <ul>
    {props.docs.map((doc, i) => {
       return (<li key={doc.id}>
         <Link to={props.linkResolver(doc)}>{doc.slug}</Link>
       </li>);
     })}
  </ul>
);

export class DocumentListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: []
    };
  }
  componentDidMount() {
    this.props.api.form("everything").ref(this.props.api.master()).submit((err, res) => {
      this.setState({docs: res.results});
    });
  }
  render() {
    return <DocumentList docs={this.state.docs} linkResolver={this.props.linkResolver} />;
  }
}
DocumentListContainer.propTypes = {
  api: React.PropTypes.object.isRequired, // Prismic api object
  linkResolver: React.PropTypes.func.isRequired,
  q: React.PropTypes.string // Prismic query
};
