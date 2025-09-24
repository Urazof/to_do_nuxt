import { User } from '@/server/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '1h'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Email already exists' })
  }

  const user = await User.create({ email, password })
  const token = jwt.sign(
    { userId: user._id.toString() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return { 
    message: 'User created',
    userId: user._id.toString(),
    token,
    expiresIn: 3600 // 1 hour in seconds
  }
})
