/**
 * Утилиты для работы с базой данных MongoDB
 */
import Todo from '../models/Todo'
import { User } from '../models/User'

/**
 * Создание индексов для всех моделей
 * Вызывается при инициализации приложения для обеспечения существования всех индексов
 */
export async function ensureIndexes() {
  try {
    console.log('🔍 Создание индексов для базы данных...')

    // Создание индексов для модели User
    await User.createIndexes()
    console.log('✅ Индексы для User созданы')

    // Создание индексов для модели Todo
    await Todo.createIndexes()
    console.log('✅ Индексы для Todo созданы')

    console.log('✅ Все индексы успешно созданы')
  } catch (error) {
    console.error('❌ Ошибка при создании индексов:', error)
    throw error
  }
}

/**
 * Информация о существующих индексах
 */
export async function getIndexesInfo() {
  const userIndexes = await User.collection.getIndexes()
  const todoIndexes = await Todo.collection.getIndexes()

  return {
    user: userIndexes,
    todo: todoIndexes,
  }
}

