import Todo from '@/server/models/Todo';

export default defineEventHandler(async (_event) => {
    const todos = await Todo.find();

    return {
        todos
    };
});
