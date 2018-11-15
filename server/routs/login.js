import express from 'express'
import bodyParser from 'body-parser'
import UserService from '../services/user'
const jsonBodyParser = bodyParser.json()
const router = express.Router()

router.post('/login', jsonBodyParser, async ({ body }, res) => {
  try {
    const user = await UserService.findOrCreateUser(body)
    const authToken = await UserService.generateToken(user)
    res.status(200).json({ authToken })
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
})

export default router
