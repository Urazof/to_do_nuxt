import Todo from "../../models/Todo";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    const { isDone } = await readBody(event);
    await Todo.findByIdAndUpdate(id, { isDone: isDone }, { new: true })
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
