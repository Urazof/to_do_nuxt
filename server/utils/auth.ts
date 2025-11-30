import { verifyAccessToken } from '@/server/utils/jwt'

/**
 * Middleware для защиты API endpoints с помощью JWT токена
 *
 * Использование:
 * В любом API endpoint добавьте:
 *
 * export default defineEventHandler(async (event) => {
 *   const user = await requireAuth(event)
 *   // user.userId содержит ID аутентифицированного пользователя
 *   // Ваш код здесь...
 * })
 */
export async function requireAuth(event: any) {
  // Получаем токен из заголовка Authorization
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Authorization header is required'
    })
  }

  // Проверяем формат Bearer токена
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw createError({
      statusCode: 401,
      message: 'Invalid authorization header format. Use: Bearer <token>'
    })
  }

  const token = parts[1]

  // Верифицируем токен
  const payload = verifyAccessToken(token)

  // Возвращаем payload с userId
  return {
    userId: payload.userId
  }
}

/**
 * Опциональная аутентификация - не выбрасывает ошибку если токен отсутствует
 *
 * Использование:
 * export default defineEventHandler(async (event) => {
 *   const user = await optionalAuth(event)
 *   if (user) {
 *     // Пользователь аутентифицирован
 *   } else {
 *     // Анонимный доступ
 *   }
 * })
 */
export async function optionalAuth(event: any) {
  try {
    return await requireAuth(event)
  } catch {
    return null
  }
}

