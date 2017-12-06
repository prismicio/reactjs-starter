import React from 'react';
import $ from 'jquery';
import hljs from 'highlight.js';
import PrismicConfig from './prismic-configuration';

export default class Help extends React.Component {

  static validateOnboarding() {
    const repoEndpoint = PrismicConfig.apiEndpoint.replace('/api/v2', '');
    fetch(`${repoEndpoint}/app/settings/onboarding/run`, { method: 'POST' })
      .catch(() => console.log('Cannot access your repository, check your api endpoint'));
  }

  static getRepositoryInfo() {
    const repoRegexp = /^(https?:\/\/([-\w]+)\.[a-z]+\.(io|dev))\/api(\/v2)?$/;
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
        <a target="_blank" rel="noopener noreferrer" href="https://prismic.io/docs/reactjs/getting-started/getting-started-from-scratch" className="doc">Documentation<img src="images/open.svg" alt="" /></a>
      </nav>
    );
  }

  static renderHeader(repositoryInfo) {
    const firstStep = repositoryInfo.isConfigured
      ? <li className="done"><span className="number">1</span>Bootstrap your project</li>
      : <li><a href="#config"><span className="number">1</span>Bootstrap your project<img src="images/arrow.svg" alt="" /></a></li>
    return (
      <header>
        {Help.renderNavbar(repositoryInfo)}
        <div className="wrapper">
          <img src="images/rocket.svg" alt="" />
          <h1>High five, you deserve it!</h1>
          <p>Grab a well deserved cup of coffee, you're {repositoryInfo.isConfigured ? 'two' : 'three'} steps away from creating a page with dynamic content.</p>
        </div>
        <div className="hero-curve" />
        <div className="flip-flap">
          <div className="flipper">
            <div className="guide">
              <ul>
                {firstStep}
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
            If you haven't yet, create a prismic.io content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank" rel="noopener noreferrer">create one</a> by choosing a repository name and a plan. We've got a variety of plans including our favorite, Free!
          </p>
          <h4>Add the repository URL to your configuration</h4>
          <p>Replace the repository url in your prismic configuration with your-repo-name.prismic.io</p>
          <div className="source-code">
            <pre><code className="js">{`// In src/prismic-configuration.js
apiEndpoint: "https://your-repo-name.prismic.io/api/v2",`}
            </code></pre>
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
          We will query the page by its UID right before the component is mounted. Then we will update your component state.
          <span className="note">Note that you will need to include a UID field in your Custom Type in order for this to work.</span>
          Create a new file <code className="tag">src/Page.js</code> and paste the following code into your new file. Make sure to replace <code className="tag">{'<your-custom-type-id>'}</code> below with the API ID of your Custom Type.
        </p>
        <div className="source-code">
          <pre><code className="jsx">{`// In src/Page.js

import React from 'react';
import NotFound from './NotFound';
import PrismicReact from 'prismic-reactjs';

// Declare your component
export default class Page extends React.Component {

  state = {
    doc: null,
    notFound: false,
  }

  componentWillMount() {
    this.fetchPage(this.props);
  }

  componentWillReceiveProps(props) {
    this.fetchPage(props);
  }

  componentDidUpdate() {
    this.props.prismicCtx.toolbar();
  }

  fetchPage(props) {
    if (props.prismicCtx) {
      // We are using the function to get a document by its uid
      return props.prismicCtx.api.getByUID('<your-custom-type-id>', props.match.params.uid, {}, (err, doc) => {
        if (doc) {
          // We put the retrieved content in the state as a doc variable
          this.setState({ doc });
        } else {
          // We changed the state to display error not found if no matched doc
          this.setState({ notFound: !doc });
        }
      });
    }
    return null;
  }

  render() {
    // We will fill in this section in Step 3...
    return null;
  }
}`}
          </code></pre>
        </div>
        <p>
          To discover all the functions you can use to query your documents go to <a href="https://prismic.io/docs/reactjs/query-the-api/how-to-query-the-api" rel="noopener noreferrer" target="_blank">the prismic documentation</a>.
        </p>
        <p>
          Now you need to link your component to a URL by defining a route.
          <br />
          In the following example we'll link a <code className="tag">/page/:uid</code> URL to the new <code className="tag">Page</code> component.
        </p>
        <div className="source-code">
          <pre><code className="jsx">{`// In src/App.js

// Add this to list of imports at the top of the page
import Page from './Page';

// Add the following route in your Router component before the NotFound route
<Route exact path="/page/:uid" render={routeProps => <Page {...routeProps} prismicCtx={props.prismicCtx} />} />`}
          </code></pre>
        </div>
      </div>
    );
  }

  static renderTemplateSection() {
    return (
      <div>
        <h3 id="done"><span className="number">3</span>Fill a template</h3>
        <p>
          Now all that's left to be done is to display your component using the <code className="tag">render</code> function.
        </p>
        <p>
          You can get the content using the <code className="tag">doc</code> state variable we defined above. All the content fields are accessed using their <code className="tag">API-IDs</code>. For example if you have an image field with the API-ID <code className="tag">main_image</code>, then you can access the image content with <code className="tag">this.state.doc.data.<strong>main_image</strong></code>.
        </p>
        <div className="source-code">
          <pre><code>{`// In src/Page.js

render() {
  if (this.state.doc) {
    return (
      <div data-wio-id={this.state.doc.id}>
        {/* This is how to get an image into your template */}
        <img alt="cover" src={this.state.doc.data.`}<strong>{`your_image_field_id`}</strong>{`.url} />
        {/* This is how to insert a Rich Text field as plain text */}
        <h1>{PrismicReact.RichText.asText(this.state.doc.data.`}<strong>{`your_text_field_id`}</strong>{`)}</h1>
        {/* This is how to insert a Rich Text field into your template as html */}
        {PrismicReact.RichText.render(this.state.doc.data.`}<strong>your_description_field_id</strong>{`, this.props.prismicCtx.linkResolver)}
      </div>
    );
  } else if (this.state.notFound) {
    return <NotFound />;
  }
  return <h1>Loading</h1>;
}`}
          </code></pre>
        </div>
        <p>
          To discover how to get all the fields go to <a href="https://prismic.io/docs/reactjs/rendering/the-response-object" rel="noopener noreferrer" target="_blank">the prismic documentation</a>.
        </p>
      </div>
    );
  }

  componentDidMount() {
    Help.validateOnboarding();
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
            You can access this any time by pointing your browser to localhost:3000/help.
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
