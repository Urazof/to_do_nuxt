import Todo from '@/server/models/Todo';
import { requireAuth } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
    // Проверяем JWT токен и получаем userId
    await requireAuth(event);

    // userId теперь доступен в event.context (безопасно, из токена)
    const userId = event.context.userId;

    // Получаем все задачи текущего пользователя
    const todos = await Todo.find({ userId });

    return {
        todos
    };
});
