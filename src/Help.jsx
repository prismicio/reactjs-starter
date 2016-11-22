import React from 'react';
import { Prismic } from 'prismic.io';
//import PureComponent from 'react-pure-render/component';

class Help extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.isConfigured == true) {
      var repoNav = (<a href={this.props.repoURL} target="_blank"><strong>Go to {this.props.name}</strong></a>)
      var stepsLeft = "Two"
      var bootstrap
    } else {
      var repoNav = (<a href="#config"><strong>Configure a repository</strong></a>)
      var stepsLeft = "Three"
      var bootstrap = (
        <div>
          <h3 id="config"><span className="number">1</span>Bootstrap your project</h3>
          <p>If you haven't yet, create a prismic.io content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank">create one</a> by choosing a repository name and a plan. We’ve got a variety of plans including our favorite, Free!</p>
          <h4>Add the repository URL to your configuration</h4>
          <p>Replace the repository url in your index.jsx file with your-repo-name.prismic.io</p>
          <div className="source-code">
            <pre><code>{`
  // In index.jsx
  const endpoint = 'https://your-repo-name.prismic.io/api';
            `}</code></pre>
          </div>
        </div>
      )
    }
    
    return (
      
      <div id="prismic-help">
        <link rel="stylesheet" href="/stylesheets/reset.css"/>
        <link rel="stylesheet" href="/stylesheets/style.css"/>
        <link rel="stylesheet" href="/stylesheets/vendors/help.min.css"/>
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900" rel="stylesheet" type="text/css"/>
        
        <header>
          <nav>
            {repoNav}
            <a href="https://prismic.io/docs" className="doc">Documentation<img src="images/open.svg" alt=""/></a>
          </nav>
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
                  <li><a href="#query"><span className="number">2</span>Query the API<img src="images/arrow.svg" alt=""/></a></li>
                  <li><a href="#done"><span className="number">3</span>Fill a template<img src="images/arrow.svg" alt=""/></a></li>
                </ul>
              </div>
              <div className="gif"></div>
            </div>
          </div>
        </header>
        <section>
          <p>This is a help page included in your project, it has a few useful links and example snippets to help you getting started. You can access this any time by pointing your browser to {this.props.host}</p>
          <h2>{stepsLeft} more steps:</h2>
          {bootstrap}
          <h3 id="query"><span className="number">2</span>Create a route and retrieve content</h3>
          <p>To add a page to your project, you need to first specify a route. In the following example we set a "/page/:uid" URL to render the custom type "page" by its UID. Then create a "Page" class where you query the page content.</p>
          <div className="source-code">
            <pre><code>{`
// In index.jsx add the following route:
<Route path="/page/:uid" component={Page}/>

// Query the page content with the following query
Prismic.api(this.props.endpoint, this.props.accessToken).then(api => {
      return api.getByUID("page", this.props.params.uid, {}, ((err, doc) => {
            if (doc) {
                  this.setState({doc: doc});
            } else {
                  this.setState({notFound: true});
            }
      }));
});
            `}</code></pre>
          </div>
          <h3 id="done"><span className="number">3</span>Fill a template</h3>
          <p>Now all that's left to be done is insert your content into the template.<br/>You can get the content using the document we queried above. Let's define it as a constant pageContent. Each content field is accessed using the custom type API-ID and the field key defined in the custom type (for example 'page.image').</p>
          <div className="source-code">
            <pre><code>{`
render() {
      if (this.state.notFound) {
            return (<div>Document not found</div>);
      } else if (!this.state.doc) {
            return (<div>Loading...</div>);
      } else {
            const pageContent = this.state.doc;
            return (
                  <div className="welcome" dangerouslySetInnerHTML={{__html: 
                        '<img class="star" src="' + pageContent.getImage('page.image').url + '" />' +
                        pageContent.getStructuredText('page.title').asHtml() +
                        pageContent.getStructuredText('bloghome.description').asHtml()
                  }} />
            );
      }
}
            `}</code></pre>
          </div>
        </section>
      </div>
    );
  }

}

Help.propTypes = {
  params: React.PropTypes.object.isRequired,
  isConfigured: React.PropTypes.bool.isRequired,
  repoURL: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  host: React.PropTypes.string.isRequired,
};

export default Help;
