import { createServer } from 'http'
import SocketServer from 'socket.io'
import express from 'express'
import mongoose from 'mongoose'
import { omit } from 'ramda'
import { UserService, MessageService } from './server/services'
import loginRoute from './server/routs/login'
import {
  GET_ALL_MESSAGES,
  NEW_MESSAGE,
  ROOM_NEW_MESSAGE,
  GET_ALL_ONLINE_USERS,
  GET_ALL_USERS,
  CONNECTION,
  DISCONNECT,
  BAN_USER,
  MUTE_USER,
  ADMIN,
  CHANGE_NAME
} from './src/constants'
import {
  PORT,
  HTML_PATH,
  BUILD_PATH,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} from './server/config'

(async () => {
  await mongoose.connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true, useFindAndModify: false }
  ).then(() => console.log(`Connected to ${DB_NAME} db.`))

  const app = express()
  const server = createServer(app)
  const io = SocketServer(server)
  app.use('/api/user', loginRoute)
  app.use(express.static(BUILD_PATH)).get('*', (req, res) => (res.sendFile(HTML_PATH)))

  let ONLINE = []
  let SOCKETS = []

  const ROOM = 'cahtroom'

  io.use(async (socket, next) => {
    let token = socket.handshake.headers['authentication']
    try {
      // find user by token
      const user = await UserService.validateToken(token)
      // set current user for socket
      socket.currentUser = user
      // if banned user - disconnect
      const isBanned = await UserService.isBanned(user._id)
      const isOnline = ONLINE.find(({ _id }) => (_id === user._id))
      if (isBanned || isOnline) {
        socket.disconnect(true)
      }
      return next()
    } catch (e) {
      socket.disconnect(true)
      return next(new Error(e))
    }
  })

  io.on(CONNECTION, async (socket) => {
    const { currentUser } = socket
    const isAdmin = ADMIN === currentUser.role
    ONLINE.push(omit(['muted', 'banned'], currentUser))
    SOCKETS.push(socket)

    // ON USER_JOINED
    socket.join(ROOM, async () => {
      const messages = await MessageService.getAll()
      io.to(ROOM).emit(GET_ALL_ONLINE_USERS, ONLINE)
      socket.emit(GET_ALL_MESSAGES, messages)
      if (isAdmin) {
        const allUsers = await UserService.findAll()
        socket.emit(GET_ALL_USERS, allUsers)
      }
    })

    // ON NEW_MESSAGE
    socket.on(NEW_MESSAGE, async message => {
      const { currentUser } = socket
      const isMuted = await UserService.isMuted(currentUser._id)
      const isBanned = await UserService.isBanned(currentUser._id)
      if (!isMuted && !isBanned) {
        const { _id, body, createdAt } = await MessageService.create({ userId: currentUser._id, body: message })
        io.to(ROOM).emit(ROOM_NEW_MESSAGE, { _id, body, createdAt, userId: currentUser })
      }
    })

    // ON CHANGE NAME
    socket.on(CHANGE_NAME, async name => {
      const { currentUser } = socket
      await UserService.changeUserName(currentUser._id, name)
      currentUser.name = name
      ONLINE = ONLINE.map(user => {
        if (user._id === currentUser._id) user.name = name
        return user
      })
      const messages = await MessageService.getAll()
      io.to(ROOM).emit(GET_ALL_ONLINE_USERS, ONLINE).emit(GET_ALL_MESSAGES, messages)
    })

    // ON MUTE_USER
    socket.on(MUTE_USER, async id => {
      if (isAdmin && id !== currentUser._id) {
        await UserService.muteUser(id)
        const allUsers = await UserService.findAll()
        socket.emit(GET_ALL_USERS, allUsers)
      }
    })

    // ON BAN_USER
    socket.on(BAN_USER, async id => {
      if (isAdmin && id !== currentUser._id) {
        await UserService.banUser(id)
        const user = SOCKETS.find(({ currentUser }) => (currentUser._id === id))
        if (user) user.disconnect(true)
        const allUsers = await UserService.findAll()
        socket.emit(GET_ALL_USERS, allUsers)
      }
    })

    // ON USER_DISCONNECT
    socket.on(DISCONNECT, (reason) => {
      ONLINE = ONLINE.filter(({ _id }) => _id !== currentUser._id)
      io.to(ROOM).emit(GET_ALL_ONLINE_USERS, ONLINE)
    })
  })

  // ON DISCONNECTION SERVER
  io.on(DISCONNECT, (socket) => {
  })

  server.listen(PORT, () => console.log(`Server runs at http://localhost:${PORT}`))
})()
