import { model, Schema, Types } from 'mongoose';

const todoSchema = new Schema({
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    isDone: { type: Boolean, default: false },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Todo = model('Todo', todoSchema);

export default Todo;
