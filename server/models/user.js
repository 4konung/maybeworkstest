import mongoose from 'mongoose'
import gravatar from 'gravatar'
import { hash } from 'bcryptjs'
import { USER } from '../../src/constants'

const Schema = mongoose.Schema
const url = gravatar.url

const schema = new Schema({
  name: String,
  email: {
    type: String,
    validator: email => User.doesntExist({ email }),
    message: ({ value }) => `Email ${value} has already been taken.`
  },
  password: String,
  banned: {
    type: Boolean,
    default: false
  },
  muted: {
    type: Boolean,
    default: false
  },
  avatar: String,
  role: {
    type: String, default: USER
  },
  messages: [{
    type: Schema.Types.ObjectId, ref: 'Message'
  }]
},
{
  timestamps: true,
  id: false
})

schema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10)
  }
  if (this.isModified('email')) {
    this.avatar = url(this.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })
  }
})

schema.statics.doesntExist = async function (option) {
  return await this.findOne(option).countDocuments() === 0
}

const User = mongoose.model('User', schema)

export default User
