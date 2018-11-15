import React, { PureComponent } from 'react'
import { List, ListSubheader } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SocketService from '../services/socket-io'
import { MessageBox, MessageInput, UserCard, AppBar } from '../components'
import { getCurrentUserFromStore } from '../helpers'
import { NEW_MESSAGE, BAN_USER, MUTE_USER, CHANGE_NAME, ADMIN } from '../constants'

const messageInputBasicStyles = {
  position: 'fixed',
  bottom: '0',
  padding: '6px'
}

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100vh'
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    overflowY: 'scroll',
    marginBottom: '50px'
  },
  messageInput: {
    [theme.breakpoints.up('sm')]: {
      ...messageInputBasicStyles,
      width: 'calc(100% - 240px)',
      left: '240px'
    },
    ...messageInputBasicStyles,
    width: '100%'
  }
})

class ChatPage extends PureComponent {
  constructor () {
    super()
    this.state = {
      users: [],
      allUsers: [],
      messages: [],
      currentUser: getCurrentUserFromStore()
    }
    this.socket = SocketService(this)
    this.renderUserCard = this.renderUserCard.bind(this)
    this.handleMuteUser = this.handleMuteUser.bind(this)
    this.handleBanUser = this.handleBanUser.bind(this)
    this.handleSubmitMessage = this.handleSubmitMessage.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
  }

  componentDidMount () {
    this.socket.connect()
  }

  componentWillUnmount () {
    this.socket.disconnect()
  }

  handleSubmitMessage (message) {
    this.socket.emit(NEW_MESSAGE, message)
  }

  handleBanUser (id) {
    this.socket.emit(BAN_USER, id)
  }

  handleMuteUser (id) {
    this.socket.emit(MUTE_USER, id)
  }

  handleChangeName (name) {
    this.socket.emit(CHANGE_NAME, name)
  }

  renderUserCard (user) {
    const { currentUser } = this.state
    const { _id } = user
    return (<UserCard
      key={_id}
      {...user}
      id={_id}
      actionBan={this.handleBanUser}
      actionMute={this.handleMuteUser}
      actionChangeName={this.handleChangeName}
      currentUser={currentUser}
    />)
  }

  render () {
    const { handleSubmitMessage, renderUserCard } = this
    const { messages, users, allUsers, currentUser } = this.state
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <AppBar>
          <List
            dense
            subheader={<ListSubheader component='div'>Users online</ListSubheader>}
          >
            {users && users.map(renderUserCard)}
          </List>
          {
            currentUser.role === ADMIN ? (
              <List
                dense
                subheader={<ListSubheader component='div'>All users </ListSubheader>}
              >
                {allUsers && allUsers.map(renderUserCard)}
              </List>
            ) : (
              null
            )
          }
        </AppBar>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <MessageBox messages={messages} />
        </main>
        <div className={classes.messageInput}>
          <MessageInput onSubmitMessage={handleSubmitMessage} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ChatPage)
