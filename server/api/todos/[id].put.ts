import Todo from '@/server/models/Todo';

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    const { isDone } = await readBody(event);
    await Todo.findOneAndUpdate({id: id} , { isDone: isDone }, { new: true })
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});

