import Todo from '@/server/models/Todo';

export default defineEventHandler(async (event) => {
    const { title, id, isDone } = await readBody(event);
    const todo = new Todo({
        id: id,
        title: title,
        isDone: isDone,
    })
    debugger;
    todo.save()
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
