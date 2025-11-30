/**
 * POST /api/auth/logout
 * Выход пользователя - удаление refresh token из cookie
 *
 * Returns: { message: string }
 */
export default defineEventHandler(async (event) => {
  // Удаляем refresh token cookie
  deleteCookie(event, 'refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })

  return {
    message: 'Logged out successfully'
  }
})

