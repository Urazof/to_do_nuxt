import Todo from '@/server/models/Todo';
import { requireAuth } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
    // Проверяем JWT токен и получаем userId
    await requireAuth(event);

    // userId теперь доступен в event.context (безопасно, из токена)
    const userId = event.context.userId;

    const id = event.context.params?.id;

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

    // Удаляем задачу
    const deletedTodo = await Todo.findOneAndDelete({ id, userId });

    return {
        success: true,
        todo: deletedTodo
    };
});
