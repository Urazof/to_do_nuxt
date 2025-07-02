import { User } from '@/server/models/User'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  return { userId: user._id }
})