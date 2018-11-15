import format from 'date-fns/format'
import locale from 'date-fns/locale/ru'
import decode from 'jwt-decode'
import { has } from 'ramda'

export const hasProperty = obj => property => has(property, obj)

export const setOrGetToken = (authToken) => {
  if (authToken && typeof authToken === 'string') {
    window.sessionStorage.setItem('authToken', authToken)
  } else {
    return window.sessionStorage.getItem('authToken') || ''
  }
}

export const removeToken = () => {
  window.sessionStorage.removeItem('authToken')
}

const fetchParamsForLogin = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
}

export const loginUser = creds => {
  const { fetch } = window
  if (fetch) {
    return fetch('api/user/login', { ...fetchParamsForLogin, body: creds }).then(res => {
      if (!res.ok) throw new Error('Password incorrect')
      return res.json()
    })
  }
  throw new Error('fetch not implemented')
}

export const formatDate = date => format(date, 'HH:mm DD-MM-YY', { locale })

export const getCurrentUserFromStore = () => {
  const token = setOrGetToken()
  if (!token) return {}
  try {
    const user = decode(token)
    return user
  } catch (e) {
    return {}
  }
}
