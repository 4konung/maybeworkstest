import React, { PureComponent, Fragment } from 'react'
import { ListItem, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { ChangeNameDialog } from '.'
import { hasProperty } from '../helpers'
import { ADMIN } from '../constants'

class UserCard extends PureComponent {
  constructor () {
    super()
    this.state = {
      anchorEl: null,
      isOpen: false
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleBanUser = this.handleBanUser.bind(this)
    this.handleMuteUser = this.handleMuteUser.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.renderUserMenus = this.renderUserMenus.bind(this)
    this.renderAdminMenus = this.renderAdminMenus.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  handleClick ({ currentTarget }) {
    this.setState(prevState => ({ ...prevState, anchorEl: currentTarget }))
  }

  handleClose () {
    this.setState(prevState => ({ ...prevState, anchorEl: null }))
  }

  handleBanUser () {
    this.props.actionBan(this.props.id)
    this.handleClose()
  }

  handleMuteUser () {
    this.props.actionMute(this.props.id)
    this.handleClose()
  }

  handleChangeName () {
    this.setState(prevState => ({ ...prevState, anchorEl: null, isOpen: true }))
  }

  handleCloseModal ({ name }) {
    if (name) this.props.actionChangeName(name)
    this.setState(prevState => ({ ...prevState, isOpen: false }))
  }

  renderAdminMenus () {
    const has = hasProperty(this.props)
    return (
      <Fragment>
        {has('banned', this.props) && <MenuItem onClick={this.handleBanUser}>{this.props.banned ? 'Unban user' : 'Ban user'}</MenuItem>}
        {has('muted', this.props) && <MenuItem onClick={this.handleMuteUser}>{this.props.muted ? 'Unmute user' : 'Mute user'}</MenuItem>}
      </Fragment>
    )
  }

  renderUserMenus () {
    return (<MenuItem onClick={this.handleChangeName}>Change name</MenuItem>)
  }

  render () {
    const { handleClick, handleClose, renderAdminMenus, renderUserMenus, handleCloseModal } = this
    const { anchorEl, isOpen } = this.state
    const { avatar, name, email, currentUser, id } = this.props
    return (
      <Fragment>
        <ListItem dense disableGutters>
          <Avatar alt='' src={avatar} />
          <ListItemText primary={name || email} />
          {
            currentUser._id === id || currentUser.role === ADMIN ? (
              <ListItemSecondaryAction>
                <IconButton
                  aria-owns={anchorEl ? 'simple-menu' : undefined}
                  aria-haspopup='true'
                  onClick={handleClick}
                >
                  <MoreVert />
                </IconButton>
                <Menu
                  id='simple-menu'
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {currentUser.role === ADMIN && renderAdminMenus()}
                  {currentUser._id === id && renderUserMenus()}
                </Menu>
              </ListItemSecondaryAction>
            ) : null
          }
        </ListItem>
        { isOpen && <ChangeNameDialog
          closeModal={handleCloseModal}
          userName={name || email}
          onChangeName={handleCloseModal}
        />}
      </Fragment>
    )
  }
}

export default UserCard
