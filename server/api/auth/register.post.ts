import { User } from '@/server/models/User'
import { generateTokens, getRefreshTokenMaxAge } from '@/server/utils/jwt'

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 *
 * Body: { email: string, password: string }
 * Returns: { message, userId, accessToken, refreshToken, expiresIn }
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

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }

  // Проверка существующего пользователя
  const existing = await User.findOne({ email })
  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Email already exists'
    })
  }

  // Создание пользователя (пароль хешируется в pre-save хуке модели)
  const user = await User.create({ email, password })

  // Генерация токенов
  const tokens = generateTokens(user._id.toString())

  // Установка refresh token в httpOnly cookie
  setCookie(event, 'refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: getRefreshTokenMaxAge(),
    path: '/'
  })

  return {
    message: 'User created successfully',
    userId: user._id.toString(),
    accessToken: tokens.accessToken,
    expiresIn: tokens.expiresIn
  }
})
