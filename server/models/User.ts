import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

/**
 * Интерфейс документа пользователя в MongoDB
 */
export interface IUser extends mongoose.Document {
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

/**
 * Схема пользователя с email и захешированным паролем
 */
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // Индекс для быстрого поиска по email
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
})

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Метод для сравнения паролей
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password)
}

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
