import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Page not found (404) componenet
 */
const NotFound = () => {
  return (
    <div className="not-found" style={notFoundStyle}>
      <h1>404</h1>
      <h2>Document not found</h2>
      <p><Link to="/">Return to homepage</Link></p>
    </div>
  )
}

const notFoundStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '50vw',
  alignItems: 'center'
}

export default NotFound
