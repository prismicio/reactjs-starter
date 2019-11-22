import { useEffect } from 'react'
import qs from 'qs'
import { client, linkResolver } from '../prismic-configuration'

/**
 * Prismic preview endpoint component
 */
const Preview = ({ history, location }) => {
  useEffect(() => {
    const params = qs.parse(location.search.slice(1))
    if (!params.token) {
      return console.warn(`Unable to retrieve session token from provided url. \n
      Check https://prismic.io/docs/rest-api/beyond-the-api/the-preview-feature for more info`)
    }

    // Retrieve the correct URL for the document being previewed.
    // Once fetched, redirect to the given url
    client.previewSession(params.token, linkResolver, '/').then(url => history.push(url))
  })
  return null
}

export default Preview
