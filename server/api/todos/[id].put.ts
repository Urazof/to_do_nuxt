import Todo from '@/server/models/Todo';
import { requireAuth } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
    // Проверяем JWT токен и получаем userId
    await requireAuth(event);

    // userId теперь доступен в event.context (безопасно, из токена)
    const userId = event.context.userId;

    const id = event.context.params?.id;
    const { isDone } = await readBody(event);

    if (!id) {
        throw createError({ statusCode: 400, message: 'Missing todo id' });
    }

    // ВАЖНО: Проверяем, что задача принадлежит текущему пользователю
    const todo = await Todo.findOne({ id, userId });

    if (!todo) {
        throw createError({
            statusCode: 404,
            message: 'Todo not found or access denied'
        });
    }

    // Обновляем задачу
    const updatedTodo = await Todo.findOneAndUpdate(
        { id, userId },
        { isDone },
        { new: true }
    );

    return { todo: updatedTodo };
});

