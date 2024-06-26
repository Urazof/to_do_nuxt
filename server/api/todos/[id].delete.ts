import Todo from '@/server/models/Todo';
import { Types } from 'mongoose';
export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    Todo.findOneAndDelete({id: id})
        .then((doc) => {
            console.log(doc)
        })
        .catch((err) => {
            console.error(err)
        })
});
