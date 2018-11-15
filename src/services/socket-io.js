import io from 'socket.io-client'
import { setOrGetToken, removeToken } from '../helpers'
import { DISCONNECT, GET_ALL_ONLINE_USERS, GET_ALL_MESSAGES, ROOM_NEW_MESSAGE, GET_ALL_USERS } from '../constants'

const SocketService = (component) => {
  const options = {
    transportOptions: {
      polling: {
        extraHeaders: {
          'authentication': setOrGetToken()
        }
      }
    },
    reconnection: true,
    autoConnect: false
  }
  const socket = io(options)
  socket.on(DISCONNECT, () => removeToken())
  socket.on(GET_ALL_ONLINE_USERS, (users) => {
    component.setState(state => ({ ...state, users }))
  })
  socket.on(GET_ALL_MESSAGES, messages => {
    component.setState(prevState => ({ ...prevState, messages }))
  })
  socket.on(ROOM_NEW_MESSAGE, message => {
    component.setState(prevState => ({ ...prevState, messages: [...prevState.messages, message] }))
  })
  socket.on(GET_ALL_USERS, allUsers => {
    component.setState(prevState => ({ ...prevState, allUsers }))
  })
  return {
    emit: (event, payload) => {
      socket.emit(event, payload)
    },
    disconnect: () => {
      socket.close()
    },
    connect: () => {
      socket.open()
    }
  }
}

export default SocketService
