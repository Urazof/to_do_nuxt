import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { useAuth } from '@/composables/useAuth'

/**
 * Auth Store - управление состоянием аутентификации
 * Токены управляются через composable useAuth()
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.error = null
      try {
        const auth = useAuth()
        const { userId } = await auth.login(credentials)

        this.user = {
          id: userId,
          email: credentials.email,
        }

        // Сохраняем user info в localStorage для восстановления при перезагрузке
        if (import.meta.client) {
          localStorage.setItem('userId', userId)
          localStorage.setItem('userEmail', credentials.email)
        }

        await navigateTo('/todos')
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async register(credentials: { email: string; password: string }) {
      this.error = null
      try {
        const auth = useAuth()
        const { userId } = await auth.register(credentials)

        this.user = {
          id: userId,
          email: credentials.email,
        }

        // Сохраняем user info в localStorage для восстановления при перезагрузке
        if (import.meta.client) {
          localStorage.setItem('userId', userId)
          localStorage.setItem('userEmail', credentials.email)
        }

        await navigateTo('/login')
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async logout() {
      this.error = null
      try {
        const auth = useAuth()
        await auth.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        if (import.meta.client) {
          localStorage.removeItem('userId')
          localStorage.removeItem('userEmail')
        }
        await navigateTo('/')
      }
    },

    async initialize() {
      if (import.meta.server) return

      try {
        const auth = useAuth()
        await auth.initialize()

        // Восстанавливаем user info из localStorage если токен валиден
        const userId = localStorage.getItem('userId')
        const email = localStorage.getItem('userEmail')

        if (userId && email) {
          this.user = { id: userId, email }
        }
      } catch (error) {
        // Если инициализация не удалась, очищаем данные
        console.error('Auth initialization failed:', error)
        this.user = null
        if (import.meta.client) {
          localStorage.removeItem('userId')
          localStorage.removeItem('userEmail')
        }
      }
    },
  },
})
