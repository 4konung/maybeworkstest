import React, { PureComponent } from 'react'
import { loginUser, setOrGetToken, removeToken } from '../helpers'
import { LoginForm } from '../components'
import { getLinkByName } from '../router'
import { CHAT_PAGE } from '../constants'

class LoginPage extends PureComponent {
  constructor () {
    super()
    this.submitForm = this.submitForm.bind(this)
  }
  componentDidMount () {
    removeToken()
  }

  submitForm ({ email, password }) {
    const body = JSON.stringify({ email, password })
    return loginUser(body).then(
      ({ authToken }) => {
        setOrGetToken(authToken)
        const { push } = this.props.history
        const pathname = getLinkByName(CHAT_PAGE)
        push({ pathname })
      }
    )
  }

  render () {
    const { submitForm } = this
    return (
      <LoginForm
        loginUser={submitForm}
      />
    )
  }
}

export default LoginPage
