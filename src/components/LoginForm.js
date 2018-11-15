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
import { loginSchema } from '../validation'

const initialValues = {
  email: '',
  password: ''
}

class LoginForm extends PureComponent {
  render () {
    const { fullScreen,
      values,
      errors,
      handleChange,
      handleSubmit,
      submitForm,
      isSubmitting
    } = this.props

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open
          aria-labelledby='responsive-dialog-title'
        >
          <DialogTitle id='responsive-dialog-title'>Log in please.</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} noValidate='novalidate'>
              <TextField
                fullWidth
                id='email'
                name='email'
                type='email'
                margin='normal'
                placeholder='Input email here...'
                label={errors.email || 'Email'}
                error={errors.email}
                onChange={handleChange}
                value={values.email}
              />
              <TextField
                fullWidth
                id='password'
                name='password'
                type='password'
                margin='normal'
                placeholder='Input password here...'
                label={errors.password || 'Password'}
                error={errors.password}
                onChange={handleChange}
                value={values.password}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button type='submit' onClick={submitForm} color='primary' variant='contained' disabled={isSubmitting}>
                Log in
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const ResponsiveLoginForm = withMobileDialog()(LoginForm)

export default withFormik({
  mapPropsToValues: () => (initialValues),
  validationSchema: loginSchema,
  handleSubmit: (values, { setFieldError, props, setSubmitting }) => {
    props.loginUser(values).catch(({ message }) => {
      setFieldError('password', message)
      setSubmitting(false)
    })
  }
})(ResponsiveLoginForm)
