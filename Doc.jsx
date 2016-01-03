import React from 'react';
import { Prismic } from 'prismic.io';
import { prismicApi, prismicQuery } from './prismic-es6';
import shouldPureComponentUpdate from 'react-pure-render/function';

const { Predicates } = Prismic;

class Doc extends React.Component {

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.state = {
      notFound: false,
      doc: null
    };
  }

  componentDidMount() {
    prismicApi(this.props.endpoint, this.props.accessToken).then(api => {
      return prismicQuery(api, Predicates.at('document.id', this.props.params.id));
    }).then(res => {
      if (res.results.length > 0) {
        this.setState({doc: res.results[0]});
      } else {
        this.setState({notFound: true});
      }
    });
  }

  render() {
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

}

Doc.propTypes = {
  params: React.PropTypes.object.isRequired,
  linkResolver: React.PropTypes.func.isRequired,
  endpoint: React.PropTypes.string.isRequired,
  accesstoken: React.PropTypes.string
};

export default Doc;

