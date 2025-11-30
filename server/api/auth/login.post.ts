import { User } from '@/server/models/User'
import { generateTokens } from '@/server/utils/jwt'

/**
 * POST /api/auth/login
 * Аутентификация пользователя
 *
 * Body: { email: string, password: string }
 * Returns: { userId, accessToken, refreshToken, expiresIn }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Валидация входных данных
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  // Поиск пользователя
  const user = await User.findOne({ email })
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Проверка пароля
  const isPasswordValid = await user.comparePassword(password)
  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Генерация токенов
  const tokens = generateTokens(user._id.toString())

  return { 
    userId: user._id.toString(),
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: tokens.expiresIn
  }
})
