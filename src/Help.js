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
    const repoRegexp = /^(https?:\/\/([-\w]+)\.[a-z]+\.(io|dev|test))\/api(\/v2)?$/;
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
          <p>Grab a well deserved cup of coffee, you're {repositoryInfo.isConfigured ? 'four' : 'five'} steps away from creating a page with dynamic content.</p>
        </div>
        <div className="hero-curve" />
        <div className="flip-flap">
          <div className="flipper">
            <div className="guide">
              <ul>
                {firstStep}
                <li><a href="#custom-type"><span className="number">2</span>Setup a "Page" Custom Type<img src="images/arrow.svg" alt="" /></a></li>
                <li><a href="#first-page"><span className="number">3</span>Create your first page<img src="images/arrow.svg" alt="" /></a></li>
                <li><a href="#query"><span className="number">4</span>Create a route and retrieve content<img src="images/arrow.svg" alt="" /></a></li>
                <li><a href="#done"><span className="number">5</span>Fill a template<img src="images/arrow.svg" alt="" /></a></li>
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
            If you haven't yet, create a Prismic content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank" rel="noopener noreferrer">create one</a> by choosing a repository name and a plan. We've got a variety of plans including our favorite, Free!
          </p>
          <h4>Add the repository URL to your configuration</h4>
          <p>Replace the repository url in your prismic configuration with <code className="tag">your-repo-name.prismic.io</code></p>
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

  static renderCustomTypeSection() {
    return (
      <div>
        <h3 id="custom-type"><span className="number">2</span>Setup a "Page" Custom Type</h3>
        <p></p>
        <h4>Create a new Custom Type</h4>
        Go to the repository backend you've just created. Navigate to the "Custom Types" section (icon on the left navbar) and create a new Repeatable Type. For this tutorial let's name it "Page".
        <span className="note">Before clicking on button "Create new custom type", make sure that the system automatically assigns this an API ID of <code className="tag">page</code>, because we'll use it later for querying the page.</span>
        Once the "Page" Custom Type is created, we have to define how we want to model it. Click on "JSON editor" (right sidebar) and paste the following JSON data into the Custom Type JSON editor. When you're done, hit the "Save" button.
        <p></p>
        <div className="source-code">
          <pre>
            <code className="json">{`{
  "Main" : {
    "uid" : {
      "type" : "UID",
      "config" : {
        "placeholder" : "UID"
      }
    },
    "title" : {
      "type" : "StructuredText",
      "config" : {
        "single" : "heading1",
        "placeholder" : "Title..."
      }
    },
    "description" : {
      "type" : "StructuredText",
      "config" : {
        "multi" : "paragraph,em,strong,hyperlink",
        "placeholder" : "Description..."
      }
    },
    "image" : {
      "type" : "Image"
    }
  }
}`}
              </code>
              </pre>
          </div>
      </div>
    );
  }

  static renderFirstPageSection() {
    return (
      <div>
        <h3 id="first-page"><span className="number">3</span>Create your first page</h3>
        <p>
          The "Page" Custom Type you've just created contains a title, a paragraph, an image and a UID (unique identifier). Now it is time to fill in your first page!
          <br/><br/>
          Go to "Content," hit "New," &amp; fill in the corresponding fields. 
          <span className="note">Note the value you filled in the UID field, because it will be a part of the page URL. For this example enter the value, <code className="tag">first-page</code>.</span>
          When you're done, hit "Save" then "Publish".
        </p>
      </div>
    );
  }

  static renderRouteSection() {
    return (
      <div>
        <h3 id="query"><span className="number">4</span>Create a route and retrieve content</h3>
        <p>
          You need to create the Page component and fetch your content.
          We will query the page by its UID right before the component is mounted. Then we will update your component state.
          <br/><br/>
          Create a new file <code className="tag">src/Page.js</code> and paste the following code into your new file.
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
      return props.prismicCtx.api.getByUID('page', props.match.params.uid, {}, (err, doc) => {
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
    // We will fill in this section in Step 5...
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
        <h3 id="done"><span className="number">5</span>Fill a template</h3>
        <p>
          Now all that's left to be done is to display your component using the <code className="tag">render</code> function.
        </p>
        <p>
          You can get the content using the <code className="tag">doc</code> state variable we defined above. All the content fields are accessed using their <code className="tag">API-IDs</code>.
        </p>
        <div className="source-code">
          <pre><code>{`// In src/Page.js

render() {
  if (this.state.doc) {
    return (
      <div data-wio-id={this.state.doc.id}>
        {/* This is how to get an image into your template */}
        <img alt="cover" src={this.state.doc.data.image.url} />
        {/* This is how to insert a Rich Text field as plain text */}
        <h1>{PrismicReact.RichText.asText(this.state.doc.data.title)}</h1>
        {/* This is how to insert a Rich Text field into your template as html */}
        {PrismicReact.RichText.render(this.state.doc.data.description, this.props.prismicCtx.linkResolver)}
      </div>
    );
  } else if (this.state.notFound) {
    return <NotFound />;
  }
  return <h1>Loading</h1>;
}`}
          </code></pre>
        </div>
        <p>In your browser go to <a href="/page/first-page">localhost:3000/page/first-page</a> and you're done! You've officially created a page that pulls content from Prismic.<br/></p>
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
          <h2>{repositoryInfo.isConfigured ? 'Four' : 'Five'} more steps:</h2>
          {Help.renderBootstrapSection(repositoryInfo)}
          {Help.renderCustomTypeSection()}
          {Help.renderFirstPageSection()}
          {Help.renderRouteSection()}
          {Help.renderTemplateSection()}
        </section>
      </div>
    );
  }
}
