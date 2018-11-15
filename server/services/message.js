import Message from '../models/message'

export default {
  create: async ({ body, userId }) => {
    const message = await Message.create({ body, userId })
    return message
  },
  getAll: async () => {
    const messages = await Message.find({}).populate({ path: 'userId', select: ['name', 'email', 'avatar'] }).lean(true)
    return messages
  }
}
