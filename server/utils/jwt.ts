import jwt, { type SignOptions } from 'jsonwebtoken'

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key'
const REFRESH_SECRET: string = process.env.REFRESH_SECRET || 'your-refresh-secret-key'
const ACCESS_TOKEN_EXPIRES: string = process.env.ACCESS_TOKEN_EXPIRES || '15m'
const REFRESH_TOKEN_EXPIRES: string = process.env.REFRESH_TOKEN_EXPIRES || '7d'

/**
 * Типы токенов
 */
export interface TokenPayload {
  userId: string
  type?: 'access' | 'refresh'
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Генерация access и refresh токенов
 */
export function generateTokens(userId: string): TokenResponse {
  const accessToken = jwt.sign(
    { userId, type: 'access' } as object,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES } as SignOptions
  )

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' } as object,
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES } as SignOptions
  )

  // Возвращаем время в секундах (15 минут = 900 секунд)
  const expiresIn = parseExpiration(ACCESS_TOKEN_EXPIRES)

  return {
    accessToken,
    refreshToken,
    expiresIn
  }
}

/**
 * Верификация access токена
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type')
    }
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired access token'
    })
  }
}

/**
 * Верификация refresh токена
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as TokenPayload
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    return decoded
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Invalid or expired refresh token'
    })
  }
}

/**
 * Парсинг строки времени экспирации в секунды
 */
function parseExpiration(expiration: string): number {
  const unit = expiration.slice(-1)
  const value = parseInt(expiration.slice(0, -1))

  switch (unit) {
    case 's': return value
    case 'm': return value * 60
    case 'h': return value * 60 * 60
    case 'd': return value * 60 * 60 * 24
    default: return 900 // по умолчанию 15 минут
  }
}

