import React from 'react'
import { apiEndpoint } from '../prismic-configuration'
import Script from 'react-load-script'

const Help = () => {
  const getRepositoryInfo = () => {
    const repoRegexp = /^(https?:\/\/([-\w]+)\.[a-z]+\.[a-z]+\.(io|dev|test))\/(api(\/v2)?|graphql)$/
    let [, url, name] = apiEndpoint.match(repoRegexp)
    url = url.replace('.cdn', '')
    const isConfigured = name !== 'your-repo-name'
    return { url, name, isConfigured }
  }

  const onHighlightLoad = () => {
    document.querySelectorAll('pre code').forEach(block => {
      window.hljs.highlightBlock(block)
    })
  }

  const repositoryInfo = getRepositoryInfo()

  return (
    <div id="prismic-help">
      <Script url="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js" onLoad={onHighlightLoad} />
      <Header repositoryInfo={repositoryInfo} />
      <section>
        <p>
          This is a help page included in your project, it has a few useful links and example snippets to help you getting started.
          You can access this any time by pointing your browser to localhost:3000/help.
        </p>
        <h2>Five more steps:</h2>
        <BootstrapSection />
        <CustomTypeSection />
        <FirstPageSection />
        <PageComponentSection />
        <RouteSection />
      </section>
    </div>
  )
}

const Header = ({ repositoryInfo }) => (
  <header>
    <Navbar {...repositoryInfo} />
    <div className="wrapper">
      <img src="images/rocket.svg" alt="" />
      <h1>High five, you deserve it!</h1>
      <p>Grab a well deserved cup of coffee, you're five steps away from creating a page with dynamic content.</p>
    </div>
    <div className="hero-curve" />
    <div className="flip-flap">
      <div className="flipper">
        <div className="guide">
          <ul>
            <li><a href="#config"><span className="number">1</span>Bootstrap your project<img src="images/arrow.svg" alt="" /></a></li>
            <li><a href="#custom-type"><span className="number">2</span>Setup a "Page" Custom Type<img src="images/arrow.svg" alt="" /></a></li>
            <li><a href="#first-page"><span className="number">3</span>Create your first page<img src="images/arrow.svg" alt="" /></a></li>
            <li><a href="#page-component"><span className="number">4</span>Create the Page component<img src="images/arrow.svg" alt="" /></a></li>
            <li><a href="#route"><span className="number">5</span>Setup the page routing<img src="images/arrow.svg" alt="" /></a></li>
          </ul>
        </div>
        <div className="gif" />
      </div>
    </div>
  </header>
)

const Navbar = ({ url, name, isConfigured }) => {
  const repoLink =
    isConfigured ?
    <a href={url} target="_blank" rel="noopener noreferrer"><strong>Go to {name}</strong></a> :
    <a href="#config"><strong>Configure a repository</strong></a>

  return (
    <nav>
      {repoLink}
      <a target="_blank" rel="noopener noreferrer" href="https://prismic.io/docs/reactjs/getting-started/getting-started-from-scratch" className="doc" >Documentation<img src="images/open.svg" alt="" /></a>
    </nav>
  )
}

const BootstrapSection = () => (
  <div>
    <h3 id="config"><span className="number">1</span>Bootstrap your project</h3>
    <p>
      Did you start this project with the help of our Command Line tool? If so, then your Prismic repository has already been created and setup with your first Custom Type. Feel free to jump ahead and <a href="#first-page">Create your first page</a>. If that's not the case, don't worry! It's only a couple steps to get you set up.
    </p>
    <p>
      If you haven't yet, create a Prismic content repository. A repository is where your website’s content will live. Simply <a href="https://prismic.io/#create" target="_blank" rel="noopener noreferrer">create one</a> by choosing a repository name and a plan. We've got a variety of plans including our favorite, Free!
    </p>
    <h4>Add the repository URL to your configuration</h4>
    <p>Replace the repository url in your prismic configuration with <code className="tag">your-repo-name.cdn.prismic.io</code></p>
    <div className="source-code">
      <pre><code className="js">{
`// In src/prismic-configuration.js
export const apiEndpoint: "https://your-repo-name.cdn.prismic.io/api/v2"
`}
      </code></pre>
    </div>
  </div>
)

const CustomTypeSection = () => (
  <div>
    <h3 id="custom-type"><span className="number">2</span>Setup a "Page" Custom Type</h3>
    <p>
      Did you start this project with the help of our Command Line tool? If so, then your Prismic repository has already been setup with the required Custom Type. Feel free to jump ahead and <a href="#first-page">Create your first page</a>. If not, follow these instructions to set things up.
    </p>
    <h4>Create a new Custom Type</h4>
      Go to the repository backend you've just created. Navigate to the "Custom Types" section (icon on the left navbar) and create a new Repeatable Type. For this tutorial let's name it "Page".
    <span className="note">Before clicking on button "Create new custom type", make sure that the system automatically assigns this an API ID of <code className="tag">page</code>, because we'll use it later for querying the page.</span>
      Once the "Page" Custom Type is created, we have to define how we want to model it. Click on "JSON editor" (right sidebar) and paste the following JSON data into the Custom Type JSON editor. When you're done, hit the <code className="tag">Save</code> button.
    <p />
    <div className="source-code">
      <pre>
        <code className="json">{
`{
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
)

const FirstPageSection = () => (
  <div>
    <h3 id="first-page"><span className="number">3</span>Create your first page</h3>
    <p>
      The "Page" Custom Type you've just created contains a title, a paragraph, an image and a UID (unique identifier). Now it is time to fill in your first page!
      <br /><br />
      Go to "Content," hit "New," &amp; fill in the corresponding fields.
      <span className="note">Note the value you filled in the UID field, because it will be a part of the page URL. For this example enter the value, <code className="tag">first-page</code>.</span>
      When you're done, hit <code className="tag">Save</code> then <code className="tag">Publish</code>.
    </p>
  </div>
)

const PageComponentSection = () => (
  <div>
    <h3 id="page-component"><span className="number">4</span>Create the Page component</h3>
    <p>
        You need to create the Page component and fetch your content.
        We will query the page by its UID right before the component is mounted. Then we will update your component state.
      <br /><br />
        Create a new file <code className="tag">src/pages/Page.js</code> and paste the following code into your new file.
    </p>
    <div className="source-code">
      <pre><code className="jsx">{
`// In src/pages/Page.js
import React, { useEffect, useState } from 'react'
import { RichText } from 'prismic-reactjs'
import { client, linkResolver } from '../prismic-configuration'
import NotFound from './NotFound'

const Page = ({ match }) => {
  const [doc, setDocData] = useState(null)
  const [notFound, toggleNotFound] = useState(false)

  const uid = match.params.uid

  // Get the page document from Prismic
  useEffect(() => {
    const fetchData = async () => {
      // We are using the function to get a document by its UID
      const result = await client.getByUID('page', uid)

      if (result) {
        // We use the State hook to save the document
        return setDocData(result)
      } else {
        // Otherwise show an error message
        console.warn('Page document not found. Make sure it exists in your Prismic repository')
        toggleNotFound(true)
      }
    }
    fetchData()
  }, [uid]) // Skip the Effect hook if the UID hasn't changed

  if (doc) {
    return (
      <div className="page">
        {/* This is how to get an image into your template */}
        <img src={doc.data.image.url} alt={doc.data.image.alt} />
        {/* This is how to render a Rich Text field as plain text */}
        <h1>{RichText.asText(doc.data.title)}</h1>
        {/* This is how to render a Rich Text field into your template as HTML */}
        <RichText render={doc.data.description} linkResolver={linkResolver} />
      </div>
    )
  } else if (notFound) {
    return <NotFound />
  }
  return null
}

export default Page`}
      </code></pre>
    </div>
    <p>
        To discover all the functions you can use to query your documents go to <a href="https://prismic.io/docs/reactjs/query-the-api/how-to-query-the-api" rel="noopener noreferrer" target="_blank">the prismic documentation</a>.
    </p>
  </div>
)

const RouteSection = () => (
  <div>
    <h3 id="route"><span className="number">5</span>Setup the page routing</h3>
    <p>
      Now all that's left to be done is to link your component to a URL by defining a route.
      <br />
        In the following example we'll link a <code className="tag">/page/:uid</code> URL to the new <code className="tag">Page</code> component.
    </p>
    <div className="source-code">
      <pre><code className="jsx">{
`// In src/App.js
// Add this to list of imports at the top of the page
import Page from './pages/Page'

// (...)

// Add the following route in your Router component before the NotFound route
<Route exact path='/page/:uid' component={Page} />`}
      </code></pre>
    </div>
    <p>In your browser go to <a href="/page/first-page">localhost:3000/page/first-page</a> and you're done! You've officially created a page that pulls content from Prismic.<br /></p>
    <p>
        To discover more about how to use Prismic, check out <a href="https://prismic.io/docs/reactjs/" rel="noopener noreferrer" target="_blank">the Prismic React.js documentation</a>.
    </p>
  </div>
)

export default Help
