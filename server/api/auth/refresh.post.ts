import { verifyRefreshToken, generateTokens } from '@/server/utils/jwt'

/**
 * POST /api/auth/refresh
 * Обновление access токена с помощью refresh токена
 *
 * Body: { refreshToken: string }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { refreshToken } = body

  // Валидация входных данных
  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      message: 'Refresh token is required'
    })
  }

  // Верификация refresh токена
  const payload = verifyRefreshToken(refreshToken)

  // Генерация новой пары токенов
  const tokens = generateTokens(payload.userId)

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresIn: tokens.expiresIn
  }
})

