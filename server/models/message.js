import mongoose from 'mongoose'

const Schema = mongoose.Schema

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  body: String
},
{
  timestamps: true,
  id: false
})

export default mongoose.model('Message', schema)
