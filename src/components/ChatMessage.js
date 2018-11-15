import React, { PureComponent } from 'react'
import { ListItem, Avatar, ListItemText } from '@material-ui/core'
import { formatDate } from '../helpers'

class ChatMessage extends PureComponent {
  render () {
    const { avatar, name, email, body, createdAt } = this.props
    const date = formatDate(createdAt)
    return (
      <ListItem>
        <Avatar alt='' src={avatar} />
        <ListItemText primary={name || email} secondary={`${date}: ${body}`} />
      </ListItem>
    )
  }
}

export default ChatMessage
