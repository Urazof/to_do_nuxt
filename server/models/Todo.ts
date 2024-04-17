import { model, Schema } from 'mongoose';

const todoSchema = new Schema({
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
});

const Todo = model('Todo', todoSchema);

export default Todo;
