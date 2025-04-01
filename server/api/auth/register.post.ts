import { createUser } from '@/server/models/User';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    createUser({
      email: body.email,
      password: body.password
    });
    return {
      success: true,
    };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error instanceof Error ? error.message : 'Registration failed'
    });
  }
});
