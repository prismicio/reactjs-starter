import React from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { Help, NotFound } from './pages'
import Preview from './Preview'

const App = (props) => (
  <BrowserRouter>
    <Switch>
      <Redirect exact from='/' to='/help' />
      <Route exact path='/help' component={Help} />
      <Route exact path='/preview' component={Preview} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App
