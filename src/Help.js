import React from 'react';
import $ from 'jquery';
import hljs from 'highlight.js';
import PrismicConfig from './prismic-configuration';

export default class Help extends React.Component {

  static getRepositoryInfo() {
    const repoRegexp = /^(https?:\/\/([-\w]+)\.[a-z]+\.(io|dev))\/api$/;
    const [, url, name] = PrismicConfig.apiEndpoint.match(repoRegexp);
    const isConfigured = name !== 'your-repo-name';
    return { url, name, isConfigured };
  }

  static renderNavbar({ url, name, isConfigured }) {
    const repoLink = isConfigured
      ? <a href={url} target="_blank" rel="noopener noreferrer"><strong>Go to {name}</strong></a>
      : <a href="#config"><strong>Configure a repository</strong></a>;

    return (
      <nav>
        {repoLink}
        <a target="_blank" rel="noopener noreferrer" href="https://prismic.io/docs" className="doc">Documentation<img src="images/open.svg" alt="" /></a>
      </nav>
    );
  }

  static renderHeader(repositoryInfo) {
    return (
      <header>
        {Help.renderNavbar(repositoryInfo)}
        <div className="wrapper">
          <img src="images/rocket.svg" alt="" />
          <h1>High five, you deserve it!</h1>
          <p>Grab a well deserved cup of coffee, you're two steps away from creating a page with dynamic content.</p>
        </div>
        <div className="hero-curve" />
        <div className="flip-flap">
          <div className="flipper">
            <div className="guide">
              <ul>
                <li className="done"><span className="number">1</span>Bootstrap your project</li>
                <li><a href="#query"><span className="number">2</span>Create a route and retrieve content<img src="images/arrow.svg" alt="" /></a></li>
                <li><a href="#done"><span className="number">3</span>Fill a template<img src="images/arrow.svg" alt="" /></a></li>
              </ul>
            </div>
            <div className="gif" />
          </div>
        </div>
      </header>
    );
  }

  static renderBootstrapSection({ isConfigured }) {
    if (!isConfigured) {
      return (
        <div>
          <h3 id="config"><span className="number">1</span>Bootstrap your project</h3>
          <p>
            If you haven't yet, create a prismic.io content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank" rel="noopener noreferrer">create one</a> by choosing a repository name and a plan. We’ve got a variety of plans including our favorite, Free!
          </p>
          <h4>Add the repository URL to your configuration</h4>
          <p>Replace the repository url in your prismic configuration with your-repo-name.prismic.io</p>
          <div className="source-code">
            <pre><code>{`
// In ./prismic-configuration.js
apiEndpoint: "https://your-repo-name.prismic.io/api",
          `}</code></pre>
          </div>
        </div>
      );
    }
    return null;
  }

  static renderRouteSection() {
    return (
      <div>
        <h3 id="query"><span className="number">2</span>Create a route and retrieve content</h3>

        <h4>You need to publish your content first!</h4>
        <p>
          You need to create the Page component and fetch your content.
          We will query the page by its UID right before the component is mounted and update your component state.
        </p>
        <div className="source-code">
          <pre><code>{`
// Page.jsx

import React from 'react';
import NotFound from './404.jsx';

// Declare your component
export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = { doc: null };
    }

    componentWillMount() {
        // We are using the function to get a document by its uid
        return this.props.prismicCtx.api.getByUID('<your-custom-type-id>', this.props.params.uid, {}, (err, doc) => {
            if (doc) {
                // We put the retrieved content in the state as a doc variable
                this.setState({ doc });
            } else {
                // We changed the state to display error not found if no matched doc
                this.setState({ notFound: !doc });
            }
        });
    }

    render() {
        // TODO
    }
}
          `}</code></pre>
        </div>
        <p>
          To discover all the functions you can use to query your documents go to <a href="https://prismic.io/docs/custom-types#query?lang=javascript" rel="noopener noreferrer" target="_blank">the prismic documentation</a>.
        </p>
        <p>
          Now you need to link your component to a URL by defining a route.
          <br />
          In the following example we'll link a <code className="tag">/page/:uid</code> URL to the new <code className="tag">Page</code> component.
          <br />
          The <code className="tag">withPrismic</code> attribute provides you with an easy way to set the prismic context as React props in your components.
        </p>
        <div className="source-code">
          <pre><code>{`
// index.jsx

import Page from './page.jsx';

// Add the following route in your Router component before the catch all route (path="*")
<Route path="/page/:uid" component={Page} withPrismic />
          `}</code></pre>
        </div>
      </div>
    );
  }

  static renderTemplateSection() {
    return (
      <div>
        <h3 id="done"><span className="number">3</span>Fill a template</h3>
        <p>Now all that's left to be done is display your component using the <code className="tag">render</code> function.<br />You can get the content using the <code className="tag">doc</code> we defined above. Each content field is accessed using the custom type <code className="tag">API-ID</code> and the field key defined in the custom type (for example <code className="tag">page.image</code>).</p>
        <div className="source-code">
          <pre><code>{`
// Page.jsx

render() {
    if (this.state.doc) {
        return (
            <div>
              {/* This is how to get an image into your template */}
              <img src={this.state.doc.getImage("<your-custom-type-id>.<your-field-text-id>").url}/>
              {/* This is how to get text into your template */}
              <h1>{this.state.doc.getText("<your-custom-type-id>.<your-field-text-id>")}</h1>
              {/* This is how to get structured text into your template */}
              <div dangerouslySetInnerHTML={{ __html: this.state.doc.getStructuredText("<your-custom-type-id>.<your-field-text-id>").asHtml() }} />
            </div>
        );
    } else if (this.state.notFound) {
        return <NotFound />;
    }
    return <h1>Loading</h1>;
}
          `}</code></pre>
        </div>
        <p>
          To discover how to get all the fields go to <a href="https://prismic.io/docs/fields/text#?lang=javascript" rel="noopener noreferrer" target="_blank">the prismic documentation</a>.
        </p>
      </div>
    );
  }

  componentDidMount() {
    $(document).ready(() => {
      $('pre code').each((i, block) => {
        hljs.highlightBlock(block);
      });
    });
  }

  render() {
    const repositoryInfo = Help.getRepositoryInfo();
    return (
      <div id="prismic-help">
        {Help.renderHeader(repositoryInfo)}
        <section>
          <p>
            This is a help page included in your project, it has a few useful links and example snippets to help you getting started.
            You can access this any time by pointing your browser to /help.
          </p>
          <h2>{repositoryInfo.isConfigured ? 'Two' : 'Three'} more steps:</h2>
          {Help.renderBootstrapSection(repositoryInfo)}
          {Help.renderRouteSection()}
          {Help.renderTemplateSection()}
        </section>
      </div>
    );
  }
}
