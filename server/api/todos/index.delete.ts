import Todo from "../../models/Todo";

export default defineEventHandler(async (event) => {
    const {id} = await readBody(event);
    await Todo.findByIdAndDelete(id)
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
