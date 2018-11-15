import { object, string } from 'yup'
import {
  MESSAGE_MAX_LENGTH,
  PASS_MIN_LENGTH,
  PASS_MAX_LENGTH,
  MIN_USER_NAME_LENGTH,
  MAX_USER_NAME_LENGTH,
  passwordError
} from '../constants'

export const loginSchema = object().shape({
  email: string()
    .email('Invalid email')
    .required('Required'),
  password: string()
    .min(PASS_MIN_LENGTH, 'Password too short')
    .max(PASS_MAX_LENGTH, 'Password too long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/, passwordError).required('Required')
})

export const userNameSchema = object().shape({
  name: string()
    .min(MIN_USER_NAME_LENGTH, 'User name too short.')
    .max(MAX_USER_NAME_LENGTH, 'User name too long.')
    .matches(/^[^0-9]\w+$/, 'May not contain any special chars.')
    .required('User name is required')
})

export const messageSchema = object().shape({
  body: string().max(MESSAGE_MAX_LENGTH, 'Message too long, 200 chars max.')
})
