import { model, Schema } from 'mongoose';

const todoSchema = new Schema({
    todo: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
});

const Todo = model('Todo', todoSchema);

export default Todo;
