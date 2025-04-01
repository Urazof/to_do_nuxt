import { findUserByEmail } from '@/server/models/User';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = findUserByEmail(body.email);
  if (!user || user.password !== body.password) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    });
  }

  return {
    success: true,
  };
});
