import Todo from "../../models/Todo";

export default defineEventHandler(async (event) => {
    const { title, id, isDone } = await readBody(event);
    const todo = new Todo({
        id: id,
        title: title,
        isDone: isDone,
    })

    todo.save()
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
