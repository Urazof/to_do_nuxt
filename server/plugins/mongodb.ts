import mongoose from 'mongoose'
import { ensureIndexes } from '../utils/database'

/**
 * Плагин для подключения к MongoDB при запуске сервера
 * Обеспечивает инициализацию БД и создание индексов
 */
export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()
  const mongoUri = config.mongodbUri

  try {
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')

    // Импортируем модели для регистрации схем
    await import('../models/User')
    await import('../models/Todo')

    // Создаем индексы для оптимальной производительности
    await ensureIndexes()

  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
})
