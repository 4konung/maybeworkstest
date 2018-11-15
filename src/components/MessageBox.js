import React, { PureComponent } from 'react'
import { List } from '@material-ui/core'
import ChatMessage from './ChatMessage'

class MessageBox extends PureComponent {
  constructor () {
    super ()
    this.renderMessage = this.renderMessage.bind(this)
  }
  
  renderMessage = ({ _id, body, createdAt, userId: { email, name, avatar } }) => {
    return (
      <ChatMessage
        key={_id}
        body={body}
        email={email}
        name={name}
        avatar={avatar}
        createdAt={createdAt}
      />
    )
  }

  render () {
    const { renderMessage } = this
    const { messages } = this.props

    return (
      <List>
        {messages && messages.map(renderMessage)}
      </List>
    )
  }
}

export default MessageBox
