import Todo from '@/server/models/Todo';
import { requireAuth } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
    // Проверяем JWT токен и получаем userId
    await requireAuth(event);

    // userId теперь доступен в event.context (безопасно, из токена)
    const userId = event.context.userId;

    const { title, id, isDone } = await readBody(event);

    if (!title) {
        throw createError({ statusCode: 400, message: 'Missing title' });
    }

    try {
        const todo = new Todo({
            id,
            title,
            isDone: isDone || false,
            userId // Используем userId из токена, а не из body
        });
        
        const savedTodo = await todo.save();
        return { todo: savedTodo };
    } catch (error) {
        console.error('Error creating todo:', error);
        throw createError({ statusCode: 500, message: 'Failed to create todo' });
    }
});
