import type { Todo } from '@/types/todo'
import { useAuth } from '@/composables/useAuth'

/**
 * API Service - работа с backend API
 * Использует axios instance из useAuth() с автоматическим управлением токенами
 */

/**
 * Получить API client с автоматическим добавлением токена
 */
const getApiClient = () => {
  const { apiClient } = useAuth()
  return apiClient
}

/**
 * TodoItems API
 */
export const createTodo = async (todo: Todo) => {
  try {
    const client = getApiClient()
    const response = await client.post('/todos', todo)
    return response.data
  } catch (error) {
    const message = `Error creating todo: ${(error as Error).message}`
    console.error(message)
    throw new Error(message)
  }
}

export const getTodos = async () => {
  try {
    const client = getApiClient()
    const response = await client.get('/todos')
    return response.data.todos
  } catch (error) {
    console.error(`Error getting todos: ${error}`)
    throw error
  }
}

export const updateTodo = async (id: string, isDone: boolean) => {
  try {
    const client = getApiClient()
    const response = await client.put(`/todos/${id}`, { isDone })
    return response.data
  } catch (error) {
    console.error(`Error updating todo: ${error}`)
    throw error
  }
}

export const deleteTodo = async (id: string) => {
  try {
    const client = getApiClient()
    const response = await client.delete(`/todos/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting todo: ${error}`)
    throw error
  }
}

