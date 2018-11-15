import React, { PureComponent, Fragment } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import { NotFound, LoginPage } from './pages'
import routs, { getLinkByName } from './router'
import { LOGIN_PAGE } from './constants'

class App extends PureComponent {
  render () {
    return (
      <Fragment>
        <CssBaseline />
        <Router>
          <Switch>
            <Route path={getLinkByName(LOGIN_PAGE)} component={LoginPage} />
            {routs.map((route, idx) => <PrivateRoute key={idx} {...route} />)}
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Fragment>
    )
  }
}

export default App
