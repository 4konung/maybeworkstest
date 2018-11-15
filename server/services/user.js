import Joi from 'joi'
import { compare } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import User from '../models/user'
import { SECRET } from '../config'
import { credentialsSchema } from '../validation'

const excludePasswordAndMessages = '-password -messages -__v'

export default {
  findById: async (id) => {
    const user = await User.findById(id).select(excludePasswordAndMessages).lean(true)
    return user
  },
  findAll: async () => {
    const users = await User.find({}).select(excludePasswordAndMessages).lean(true)
    return users
  },
  findByEmail: async (email) => {
    const user = await User.findOne({ email })
    return user
  },
  findOrCreateUser: async function ({ email, password }) {
    const user = await this.findByEmail(email)
    if (!user) {
      if (!Joi.validate({ email, password }, credentialsSchema)) {
        throw new Error('Bad user input')
      }
      const newUser = await User.create({ email, password })
      const serialized = await this.findById(newUser._id)
      return serialized
    }

    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) throw new Error('Password dosen\'t match')

    const serialized = await this.findById(user._id)
    return serialized
  },
  generateToken: async (data) => {
    try {
      const token = await sign(data, SECRET)
      return token
    } catch (e) {
      throw new Error('Token generation gone wrong')
    }
  },
  validateToken: async function (token) {
    const user = await verify(token, SECRET)
    return user
  },
  isBanned: async function (id) {
    const { banned } = await this.findById(id)
    return banned
  },
  isMuted: async function (id) {
    const { muted } = await this.findById(id)
    return muted
  },
  banUser: async function (id) {
    const { banned } = await this.findById(id)
    const user = await User.findByIdAndUpdate(id, { banned: !banned }).select(excludePasswordAndMessages).lean(true)
    return user
  },
  muteUser: async function (id) {
    const { muted } = await this.findById(id)
    const user = await User.findByIdAndUpdate(id, { muted: !muted }).select(excludePasswordAndMessages).lean(true)
    return user
  },
  getUserRole: async function (id) {
    const { role } = await this.findById(id)
    return role
  },
  changeUserName: async function (id, name) {
    const user = await User.findByIdAndUpdate(id, { name }).select(excludePasswordAndMessages).lean(true)
    return user
  }
}
