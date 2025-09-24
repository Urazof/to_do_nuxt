import { User } from '@/server/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '1h'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return { 
    userId: user._id.toString(),
    token,
    expiresIn: 3600 // 1 hour in seconds
  }
})
