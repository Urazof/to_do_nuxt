import { verifyRefreshToken, generateTokens, getRefreshTokenMaxAge } from '@/server/utils/jwt'

/**
 * POST /api/auth/refresh
 * Обновление access токена с помощью refresh токена из cookie
 *
 * Returns: { accessToken, expiresIn }
 */
export default defineEventHandler(async (event) => {
  // Получаем refresh token из cookie
  const refreshToken = getCookie(event, 'refreshToken')

  // Валидация входных данных
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: 'Refresh token not found'
    })
  }

  // Верификация refresh токена
  const payload = verifyRefreshToken(refreshToken)

  // Генерация новой пары токенов
  const tokens = generateTokens(payload.userId)

  // Обновляем refresh token в cookie
  setCookie(event, 'refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: getRefreshTokenMaxAge(),
    path: '/'
  })

  return {
    accessToken: tokens.accessToken,
    expiresIn: tokens.expiresIn
  }
})

