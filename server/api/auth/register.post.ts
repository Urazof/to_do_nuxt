import { User } from '@/server/models/User';

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({ statusCode: 400, message: 'Email already exists' })
  }

  const user = await User.create({ email, password })
  return { message: 'User created', userId: user._id }
})