import Todo from '@/server/models/Todo';

export default defineEventHandler(async (event) => {
    const { title, id, isDone, userId } = await readBody(event);

    if (!title || !userId) {
        throw createError({ statusCode: 400, message: 'Missing title or userId' })
    }

    const todo = new Todo({
        id: id,
        title: title,
        isDone: isDone,
        userId: userId  
    })
    todo.save()
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
