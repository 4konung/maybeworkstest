import React, { PureComponent } from 'react'
import { withFormik } from 'formik'
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withMobileDialog
} from '@material-ui/core'
import { userNameSchema } from '../validation'

class ChangeNameForm extends PureComponent {
  render () {
    const {
      fullScreen,
      values,
      errors,
      handleChange,
      handleSubmit,
      submitForm,
      isSubmitting,
      closeModal
    } = this.props

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open
          aria-labelledby='responsive-dialog-title'
        >
          <DialogTitle id='responsive-dialog-title'>Change name.</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} noValidate='novalidate'>
              <TextField
                fullWidth
                id='name'
                name='name'
                type='text'
                margin='normal'
                placeholder='Input your name here...'
                label={errors.name || 'Name'}
                error={errors.name}
                onChange={handleChange}
                value={values.name}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button type='submit' onClick={submitForm} color='primary' variant='contained' disabled={!values.name || isSubmitting}>
                Ok
            </Button>
            <Button onClick={closeModal} color='danger' variant='contained'>
                Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const ResponsiveChangeNameForm = withMobileDialog()(ChangeNameForm)

export default withFormik({
  mapPropsToValues: ({ userName }) => ({ name: userName }),
  validationSchema: userNameSchema,
  handleSubmit: (values, { props }) => {
    props.onChangeName(values)
  }
})(ResponsiveChangeNameForm)
