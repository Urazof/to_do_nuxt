import axios, { type AxiosInstance } from 'axios'

/**
 * Composable для управления аутентификацией
 * - Хранит access token в памяти (не в localStorage)
 * - Refresh token хранится в httpOnly cookie на сервере
 * - Предоставляет axios instance с автоматическим добавлением токена
 */
export const useAuth = () => {
  // Access token хранится только в памяти
  const accessToken = useState<string | null>('auth-access-token', () => null)
  const isAuthenticated = computed(() => !!accessToken.value)

  // Создаем axios instance с interceptors
  const createApiClient = (): AxiosInstance => {
    const client = axios.create({
      baseURL: '/api',
      withCredentials: true, // Важно для работы с cookies
    })

    // Request interceptor - добавляет access token к каждому запросу
    client.interceptors.request.use(
      (config) => {
        if (accessToken.value) {
          config.headers.Authorization = `Bearer ${accessToken.value}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - обрабатывает ошибки 401 и обновляет токен
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Если получили 401 и это не запрос на refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/auth/refresh' &&
          originalRequest.url !== '/auth/login' &&
          originalRequest.url !== '/auth/register'
        ) {
          originalRequest._retry = true

          try {
            // Пытаемся обновить токен
            const { data } = await axios.post(
              '/api/auth/refresh',
              {},
              { withCredentials: true }
            )

            // Сохраняем новый access token
            accessToken.value = data.accessToken

            // Повторяем оригинальный запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            return client(originalRequest)
          } catch (refreshError) {
            // Если refresh не удался - очищаем токен и выходим
            accessToken.value = null

            // Очищаем user info из localStorage
            if (import.meta.client) {
              localStorage.removeItem('userId')
              localStorage.removeItem('userEmail')
            }

            // Вызываем logout для очистки cookie на сервере
            try {
              await axios.post('/api/auth/logout', {}, { withCredentials: true })
            } catch (logoutError) {
              console.error('Logout after failed refresh error:', logoutError)
            }

            // Перенаправляем на страницу логина
            if (import.meta.client) {
              navigateTo('/login')
            }

            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )

    return client
  }

  // Singleton instance axios client
  const apiClient = createApiClient()

  /**
   * Вход пользователя
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials, {
        withCredentials: true,
      })

      accessToken.value = data.accessToken

      return {
        userId: data.userId,
        expiresIn: data.expiresIn,
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      )
    }
  }

  /**
   * Регистрация пользователя
   */
  const register = async (credentials: { email: string; password: string }) => {
    try {
      const { data } = await axios.post('/api/auth/register', credentials, {
        withCredentials: true,
      })

      accessToken.value = data.accessToken

      return {
        userId: data.userId,
        expiresIn: data.expiresIn,
      }
    } catch (error: any) {
      // Извлекаем сообщение об ошибке из ответа сервера
      const message = error.response?.data?.message ||
                     error.response?.data?.statusMessage ||
                     error.message ||
                     'Registration failed. Please try again.'
      throw new Error(message)
    }
  }

  /**
   * Выход пользователя
   */
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      accessToken.value = null
    }
  }

  /**
   * Обновление access token
   */
  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        '/api/auth/refresh',
        {},
        { withCredentials: true }
      )

      accessToken.value = data.accessToken

      return {
        expiresIn: data.expiresIn,
      }
    } catch (error) {
      accessToken.value = null
      throw error
    }
  }

  /**
   * Инициализация при загрузке приложения
   * Пытается обновить токен из cookie
   */
  const initialize = async () => {
    if (import.meta.server) return

    try {
      await refreshToken()
    } catch (error) {
      // Если не удалось обновить токен, значит пользователь не авторизован
      accessToken.value = null
    }
  }

  return {
    accessToken: readonly(accessToken),
    isAuthenticated,
    apiClient,
    login,
    register,
    logout,
    refreshToken,
    initialize,
  }
}

