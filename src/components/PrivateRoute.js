import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import { getLinkByName } from '../router'
import { setOrGetToken } from '../helpers'
import { LOGIN_PAGE } from '../constants'

function PrivateRoute ({ component: Component, ...rest }) {
  const isAuthenticated = setOrGetToken()
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: getLinkByName(LOGIN_PAGE),
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
