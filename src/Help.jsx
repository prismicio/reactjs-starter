import React from 'react';
import { Prismic } from 'prismic.io';
//import PureComponent from 'react-pure-render/component';

class Help extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const repoRegexp = new RegExp('^(https?:\/\/([\\-\\w]+)\\.[a-z]+\\.(io|dev))\/api$');
    const match = this.props.endpoint.match(repoRegexp);
    const repoURL = match[1];
    const name = match[2];
    const host = window.location.host + "/" + window.location.pathname.split('/')[1];
    var isConfigured = false;
    if ( name !== 'your-repo-name' ) {
      isConfigured = true;
    }
    this.setState({name, host, repoURL, isConfigured});
  }

  componentDidMount() {
    $(document).ready(function(){$('pre code').each(function(i, block){hljs.highlightBlock(block);});});
  }

  renderNavbar() {
    const repoLink = this.state.isConfigured
      ? <a href={this.state.repoURL} target="_blank"><strong>Go to {this.state.name}</strong></a>
      : <a href="#config"><strong>Configure a repository</strong></a>

    return (
      <nav>
        {repoLink}
        <a href="https://prismic.io/docs" className="doc">Documentation<img src="images/open.svg" alt=""/></a>
      </nav>
    )
  }

  renderHeader() {
    return (
      <header>
        {this.renderNavbar()}
        <div className="wrapper"><img src="images/rocket.svg" alt=""/>
          <h1>High five, you deserve it!</h1>
          <p>Grab a well deserved cup of coffee, you're two steps away from creating a page with dynamic content.</p>
        </div>
        <div className="hero-curve"></div>
        <div className="flip-flap">
          <div className="flipper">
            <div className="guide">
              <ul>
                <li className="done"><span className="number">1</span>Bootstrap your project</li>
                <li><a href="#query"><span className="number">2</span>Create a route and retrieve content<img src="images/arrow.svg" alt=""/></a></li>
                <li><a href="#done"><span className="number">3</span>Fill a template<img src="images/arrow.svg" alt=""/></a></li>
              </ul>
            </div>
            <div className="gif"></div>
          </div>
        </div>
      </header>
    )
  }

  renderBootstrapSection() {
    if(this.state.isConfigured) return
    else {
      return (
        <div>
          <h3 id="config"><span className="number">1</span>Bootstrap your project</h3>
          <p>If you haven't yet, create a prismic.io content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank">create one</a> by choosing a repository name and a plan. We’ve got a variety of plans including our favorite, Free!</p>
          <h4>Add the repository URL to your configuration</h4>
          <p>Replace the repository url in your index.jsx file with your-repo-name.prismic.io</p>
          <div className="source-code">
          <pre><code>{`
// In ./src/index.jsx
const endpoint = 'https://your-repo-name.prismic.io/api';
          `}</code></pre>
          </div>
        </div>
      )
    }
  }

  renderRouteSection() {
    return (
      <div>
        <h3 id="query"><span className="number">2</span>Create a route and retrieve content</h3>

        <h4>You need to publish your content first !</h4>
        <p>
          To add a page to your project, you need to first specify a route. The route contains the URL will allow you to link a React component.
          <br />
          In the following example we'll link a <code className="tag">/page/:uid</code> URL to a new <code className="tag">Page</code> component.
          <br />
          The <code className="tag">withPrismic</code> attribute provide you an easy way to set the prismic context as props in your components.
        </p>
          <div className="source-code">
          <pre><code>{`
// In ./src/index.jsx

// import your Page Component
import Page from './page.jsx';

// In ./src/index.jsx add the following route:
<Route path="/page/:uid" component={Page} withPrismic={true} />
          `}</code></pre>
        </div>
        <p>
          Now you need to create the Page component and fetch your content.
          We will do so as soon as the component is mounted, retrieve the content of your custom type by its UID and update your component state.
        </p>
          <div className="source-code">
          <pre><code>{`
// create a new Page.jsx

// import React dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// declare your component
export default class Page extends React.Component {

    // React's lifecycle method triggered when the component is mounted
    componentDidMount() {
        // We are using the function to get a document by its uid
        Prismic.api(this.props.ctx.endpoint, this.props.ctx.accessToken).then(api => {
              return api.getByUID("page", this.props.params.uid, {}, ((err, doc) => {
                    if (doc) {
                          //we put the retrieved content in the state as a doc variable
                          this.setState({doc: doc});
                    } else {
                          //we changed the state to display error not found if no matched doc
                          this.setState({notFound: true});
                    }
              }));
        });
    }
}
          `}</code></pre>
        </div>
        <p>
          To discover all the functions you can use to query your documents go to <a href="https://prismic.io/docs/custom-types#query?lang=javascript" target="_blank">the prismic documentation</a>
        </p>
      </div>
    )
  }

  renderTemplateSection() {
    return (
      <div>
        <h3 id="done"><span className="number">3</span>Fill a template</h3>
        <p>Now all that's left to be done is render your component with your content into..<br/>You can get the content using the <code className="tag">doc</code> we defined above. Each content field is accessed using the custom type <code className="tag">API-ID</code> and the field key defined in the custom type (for example <code className="tag">page.image</code>).</p>
        <div className="source-code">
          <pre><code>{`
//define the render method in your React component
render() {
      // Specific case if your document is not found
    if (this.state.notFound) {
        return (<div>Document not found</div>);

    // Render a loader while you retrieved your document
    } else if (!this.state.doc) {
        return (<div>Loading...</div>);
    } else {
        // Render your content
        return (
            <div>
                {/* This is how to get an image into your template */}
                <img class="star" src={this.state.doc.getImage("<your-custom-type-id>.<your-field-text-id>").url}/>
                {/* This is how to get a text into your template */}
                <h1>{this.state.doc.getText("<your-custom-type-id>.<your-field-text-id>")}</h1>
                {/* This is how to get a structured text into your template */}
                <p dangerouslySetInnerHTML={{ __html: this.state.doc.getStructuredText("'<your-custom-type-id>.<your-field-text-id>'").asHtml() }} />
            </div>
        );
    }
}
          `}</code></pre>
        </div>
        <p>
          To discover how to get all the field go to <a href="https://prismic.io/docs/fields/text#?lang=javascript" target="_blank">the prismic documentation</a>
        </p>
      </div>
    )
  }

  render() {
    return (
      <div id="prismic-help">
        {this.renderHeader()}
        <section>
          <p>This is a help page included in your project, it has a few useful links and example snippets to help you getting started. You can access this any time by pointing your browser to {this.state.host}</p>
          <h2>{this.state.isConfigured ? 'Two' : 'Three'} more steps:</h2>
          {this.renderBootstrapSection()}
          {this.renderRouteSection()}
          {this.renderTemplateSection()}
        </section>
      </div>
    );
  }

}

export default Help;
