import { pathOr } from 'ramda'
import { LOGIN_PAGE, MAIN_PAGE, CHAT_PAGE } from '../constants'
import { LoginPage, ChatPage } from '../pages'

const LINKS = {
  [MAIN_PAGE]: '/',
  [LOGIN_PAGE]: '/login',
  [CHAT_PAGE]: '/chat'
}

export function getLinkByName (name) {
  return pathOr('/', [name], LINKS)
}

export default [
  {
    path: getLinkByName(CHAT_PAGE),
    component: ChatPage
  },
  {
    path: getLinkByName(LOGIN_PAGE),
    component: LoginPage
  },
  {
    path: getLinkByName(MAIN_PAGE),
    exact: true,
    component: LoginPage
  }
]
