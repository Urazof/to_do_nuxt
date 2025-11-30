import { model, Schema, Types } from 'mongoose';

/**
 * Интерфейс документа Todo в MongoDB
 */
export interface ITodo extends Document {
    id: string;
    title: string;
    isDone: boolean;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Схема Todo с привязкой к пользователю
 */
const todoSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    isDone: {
        type: Boolean,
        default: false,
        index: true // Индекс для фильтрации по статусу
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Индекс для быстрого поиска Todo по пользователю
    },
}, {
    timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Составной индекс для оптимизации запросов списка Todo пользователя
// Используется для эффективной выборки всех задач конкретного пользователя с сортировкой
todoSchema.index({ userId: 1, createdAt: -1 });

// Составной индекс для фильтрации по пользователю и статусу
todoSchema.index({ userId: 1, isDone: 1 });

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
