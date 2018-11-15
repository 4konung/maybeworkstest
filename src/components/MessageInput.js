import React, { PureComponent } from 'react'
import { Input, IconButton } from '@material-ui/core'
import { Send } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { withFormik } from 'formik'
import { messageSchema } from '../validation'

const styles = {
  form: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    flexGrow: '1'
  }
}

class MessageForm extends PureComponent {
  render () {
    const {
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
      classes
    } = this.props
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.input}>
          <Input
            fullWidth
            name='body'
            value={values.body}
            onChange={handleChange}
            type='text'
            placeholder='Type your message here...'
            disabled={isSubmitting}
          />
        </div>
        <IconButton type='submit' disabled={!values.body || isSubmitting}>
          <Send />
        </IconButton>
      </form>
    )
  }
} 

const StyledMessageForm = withStyles(styles)(MessageForm)

export default withFormik({
  mapPropsToValues: () => ({ body: '' }),
  validationSchema: messageSchema,
  enableReinitialize: true,
  handleSubmit: ({ body }, { props, resetForm, setFieldValue }) => {
    props.onSubmitMessage(body)
    setFieldValue('body', '')
    setTimeout(resetForm, 15000)
  }
})(StyledMessageForm)
