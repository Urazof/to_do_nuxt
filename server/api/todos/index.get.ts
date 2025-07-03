import Todo from '@/server/models/Todo';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const userId = query.userId;
    
    if (!userId) {
        return createError({ statusCode: 400, message: 'Missing userId parameter' });
    }

    const todos = await Todo.find({ userId });

    return {
        todos
    };
});
