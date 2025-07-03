import Todo from '@/server/models/Todo';

export default defineEventHandler(async (event) => {
    const { title,id, isDone, userId } = await readBody(event);

    if (!title || !userId) {
        throw createError({ statusCode: 400, message: 'Missing title or userId' });
    }

    try {
        const todo = new Todo({
            id,
            title,
            isDone: isDone,
            userId
        });
        
        const savedTodo = await todo.save();
        return { todo: savedTodo };
    } catch (error) {
        console.error('Error creating todo:', error);
        throw createError({ statusCode: 500, message: 'Failed to create todo' });
    }
});
