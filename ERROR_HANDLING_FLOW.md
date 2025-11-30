# Error Handling Flow - Complete Documentation

## Overview
Полная документация по обработке ошибок в системе аутентификации и API запросах.

## 1. Login Flow - Обработка ошибок

### Путь ошибки при логине:
```
User → LoginForm → handleLogin() → authStore.login() → useAuth().login() → Backend
```

### Точки обработки:

#### 1.1. Backend Error (server/api/auth/login.post.ts)
**Возможные ошибки:**
- `400`: "Email and password are required"
- `401`: "Invalid credentials" (неверный email или пароль)
- `500`: Database errors

**Пример ответа:**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

#### 1.2. useAuth().login() (composables/useAuth.ts, строка ~82)
**Обработка:**
```typescript
catch (error: any) {
  const message = error.response?.data?.message ||      // Сообщение от сервера
                 error.response?.data?.statusMessage || // Alt message
                 error.message ||                       // Network error
                 'Login failed. Please check your credentials.' // Fallback
  throw new Error(message)
}
```

**Примеры извлекаемых сообщений:**
- От сервера: "Invalid credentials"
- Сетевые: "Network Error"
- Fallback: "Login failed. Please check your credentials."

#### 1.3. authStore.login() (stores/useAuthStore.ts, строка ~18)
**Обработка:**
```typescript
catch (error: any) {
  this.error = error.message  // Сохраняем в store
  throw error                 // Пробрасываем дальше
}
```

#### 1.4. pages/login.vue (строка ~24)
**Финальная обработка:**
```typescript
catch (error) {
  errorMessage.value = error.message  // Показываем пользователю
}
```

**UI:**
```vue
<WarningAlert 
  v-if="errorMessage"
  :message="errorMessage"
  type="error"
/>
```

### Результат:
✅ Пользователь видит точное сообщение об ошибке от сервера
✅ Ошибка не теряется на промежуточных этапах
✅ Есть fallback на случай отсутствия сообщения

---

## 2. Register Flow - Обработка ошибок

### Путь ошибки при регистрации:
```
User → RegisterForm → handleRegister() → authStore.register() → useAuth().register() → Backend
```

### Точки обработки:

#### 2.1. Backend Error (server/api/auth/register.post.ts)
**Возможные ошибки:**
- `400`: "Email and password are required"
- `400`: "Password must be at least 6 characters"
- `400`: "Email already exists"
- `500`: Database errors

**Пример ответа:**
```json
{
  "statusCode": 400,
  "message": "Email already exists"
}
```

#### 2.2. useAuth().register() (composables/useAuth.ts, строка ~103)
**Обработка:**
```typescript
catch (error: any) {
  const message = error.response?.data?.message ||
                 error.response?.data?.statusMessage ||
                 error.message ||
                 'Registration failed. Please try again.'
  throw new Error(message)
}
```

#### 2.3. authStore.register() (stores/useAuthStore.ts, строка ~42)
**Обработка:**
```typescript
catch (error: any) {
  this.error = error.message
  throw error
}
```

#### 2.4. pages/register.vue (строка ~24)
**Финальная обработка:**
```typescript
catch (error) {
  errorMessage.value = error.message
}
```

**Дополнительный обработчик:**
```typescript
const handleError = (message) => {
  errorMessage.value = message  // От формы валидации
}
```

### Результат:
✅ Серверные ошибки отображаются точно
✅ Клиентские ошибки валидации (из формы) тоже обрабатываются
✅ Два источника ошибок: сервер и форма

---

## 3. API Requests Flow - Обработка ошибок

### Путь запроса:
```
TodoStore → API Service → useAuth().apiClient → Interceptors → Backend
```

### Точки обработки:

#### 3.1. Request Interceptor (composables/useAuth.ts, строка ~24)
**Задача:** Добавить токен
```typescript
client.interceptors.request.use(
  (config) => {
    if (accessToken.value) {
      config.headers.Authorization = `Bearer ${accessToken.value}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

#### 3.2. Backend Error (server/api/todos/...)
**Возможные ошибки:**
- `401`: "Invalid or expired access token" (требует refresh)
- `403`: "Forbidden"
- `404`: "Todo not found"
- `500`: Database errors

#### 3.3. Response Interceptor - 401 Handler (composables/useAuth.ts, строка ~35)
**Автоматический refresh при 401:**

```typescript
if (error.response?.status === 401 && !originalRequest._retry && ...) {
  originalRequest._retry = true
  
  try {
    // Пытаемся обновить токен
    const { data } = await axios.post('/api/auth/refresh', ...)
    accessToken.value = data.accessToken
    
    // Повторяем оригинальный запрос
    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
    return client(originalRequest)
    
  } catch (refreshError) {
    // Refresh не удался - полный logout
    accessToken.value = null
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    
    await axios.post('/api/auth/logout', ...)
    navigateTo('/login')
    
    return Promise.reject(refreshError)
  }
}
```

**Сценарии:**
1. **401 + refresh успешен** → Запрос повторяется автоматически, пользователь ничего не замечает
2. **401 + refresh провален** → Logout + redirect на /login
3. **Другие ошибки (403, 404, 500)** → Пробрасываются дальше

#### 3.4. API Service Error (services/api/index.ts)
**Пример обработки:**
```typescript
export const getTodos = async () => {
  try {
    const client = getApiClient()
    const response = await client.get('/todos')
    return response.data.todos
  } catch (error) {
    console.error(`Error getting todos: ${error}`)
    throw error  // Пробрасываем в store
  }
}
```

#### 3.5. TodoStore Error (stores/useTodoStore.ts)
**Обработка в actions:**
```typescript
async getTodos() {
  const authStore = useAuthStore();
  if (authStore.user) {
    this.todos = await getTodos();  // Если ошибка - она всплывет
  }
}
```

**Проблема:** ⚠️ Нет обработки ошибок в store!

### Рекомендация: Добавить обработку ошибок в TodoStore

---

## 4. Token Refresh Flow - Обработка ошибок

### Автоматический refresh при 401:

#### 4.1. Backend Error (server/api/auth/refresh.post.ts)
**Возможные ошибки:**
- `401`: "Refresh token not found" (cookie отсутствует)
- `401`: "Invalid or expired refresh token"

#### 4.2. Response Interceptor (composables/useAuth.ts, строка ~50)
**При неудаче refresh:**
```typescript
catch (refreshError) {
  // 1. Очистка access token
  accessToken.value = null
  
  // 2. Очистка localStorage
  if (import.meta.client) {
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
  }
  
  // 3. Вызов logout API
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
  } catch (logoutError) {
    console.error('Logout after failed refresh error:', logoutError)
  }
  
  // 4. Redirect на login
  if (import.meta.client) {
    navigateTo('/login')
  }
  
  return Promise.reject(refreshError)
}
```

### Результат:
✅ Полная очистка состояния при неудачном refresh
✅ Пользователь перенаправляется на login
✅ Логи ошибок в консоли для debugging

---

## 5. Initialize Flow - Обработка ошибок

### Запуск при загрузке приложения (app.vue):
```
onMounted() → authStore.initialize() → useAuth().initialize() → refresh
```

#### 5.1. useAuth().initialize() (composables/useAuth.ts, строка ~162)
```typescript
const initialize = async () => {
  if (import.meta.server) return
  
  try {
    await refreshToken()  // Пытаемся получить токен из cookie
  } catch (error) {
    accessToken.value = null  // Молчаливая неудача = не авторизован
  }
}
```

#### 5.2. authStore.initialize() (stores/useAuthStore.ts, строка ~82)
```typescript
async initialize() {
  if (import.meta.server) return
  
  try {
    const auth = useAuth()
    await auth.initialize()
    
    // Восстанавливаем user info из localStorage
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('userEmail')
    
    if (userId && email) {
      this.user = { id: userId, email }
    }
  } catch (error) {
    console.error('Auth initialization failed:', error)
    this.user = null
    
    if (import.meta.client) {
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
    }
  }
}
```

### Результат:
✅ Если cookie валиден → пользователь авторизован
✅ Если cookie невалиден/отсутствует → молчаливая неудача
✅ Не показываем ошибки пользователю при загрузке

---

## 6. Logout Flow - Обработка ошибок

### Путь:
```
User clicks Logout → authStore.logout() → useAuth().logout() → Backend
```

#### 6.1. useAuth().logout() (composables/useAuth.ts, строка ~126)
```typescript
const logout = async () => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true })
  } catch (error) {
    console.error('Logout error:', error)  // Логируем, но не прерываем
  } finally {
    accessToken.value = null  // Всегда очищаем токен
  }
}
```

#### 6.2. authStore.logout() (stores/useAuthStore.ts, строка ~66)
```typescript
async logout() {
  this.error = null
  try {
    const auth = useAuth()
    await auth.logout()
  } catch (error) {
    console.error('Logout error:', error)  // Логируем
  } finally {
    // ВСЕГДА выполняется даже при ошибке
    this.user = null
    if (import.meta.client) {
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
    }
    await navigateTo('/')
  }
}
```

### Результат:
✅ Даже если backend logout не работает, фронтенд очищается
✅ Пользователь всегда разлогинивается локально
✅ Ошибки логируются для debugging

---

## 7. Middleware Flow - Route Protection

### middleware/auth.global.ts
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Защита /todos
  if (to.path === '/todos' && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Редирект с login/register если уже авторизован
  if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return navigateTo('/todos')
  }
})
```

### Результат:
✅ Неавторизованные пользователи не могут попасть на /todos
✅ Авторизованные автоматически перенаправляются с login на todos
✅ Работает на уровне роутинга, до загрузки компонента

---

## Summary Table - Все точки обработки ошибок

| Место | Действие | Логирование | UI отображение | Throw дальше |
|-------|----------|-------------|----------------|--------------|
| **Backend endpoints** | Создают ошибки | ❌ | ❌ | ✅ |
| **useAuth().login()** | Извлекает message | ❌ | ❌ | ✅ |
| **useAuth().register()** | Извлекает message | ❌ | ❌ | ✅ |
| **useAuth().logout()** | Логирует | ✅ | ❌ | ❌ |
| **useAuth().initialize()** | Молча игнорирует | ❌ | ❌ | ❌ |
| **Response Interceptor (401)** | Auto-refresh или logout | ✅ | ❌ | Условно |
| **authStore.login()** | Сохраняет в state | ❌ | ❌ | ✅ |
| **authStore.register()** | Сохраняет в state | ❌ | ❌ | ✅ |
| **authStore.logout()** | Логирует | ✅ | ❌ | ❌ |
| **authStore.initialize()** | Логирует + очищает | ✅ | ❌ | ❌ |
| **pages/login.vue** | Показывает alert | ❌ | ✅ | ❌ |
| **pages/register.vue** | Показывает alert | ❌ | ✅ | ❌ |
| **API Service** | Логирует | ✅ | ❌ | ✅ |
| **TodoStore** | ⚠️ Ничего | ❌ | ❌ | ✅ |

---

## Configuration - Environment Variables

### Required for maxAge calculation:
```env
REFRESH_TOKEN_EXPIRES=7d
ACCESS_TOKEN_EXPIRES=15m
JWT_SECRET=your-secret-key
REFRESH_SECRET=your-refresh-secret-key
NODE_ENV=development
```

### maxAge calculation:
```typescript
// server/utils/jwt.ts
export function getRefreshTokenMaxAge(): number {
  return parseExpiration(REFRESH_TOKEN_EXPIRES)
}

// Примеры:
// "7d" → 604800 секунд
// "24h" → 86400 секунд
// "30m" → 1800 секунд
```

---

## Recommendations for Improvement

### ⚠️ TodoStore needs error handling:
```typescript
// stores/useTodoStore.ts
async getTodos() {
  const authStore = useAuthStore();
  if (authStore.user) {
    try {
      this.todos = await getTodos();
    } catch (error: any) {
      console.error('Failed to load todos:', error);
      // Опционально: показать уведомление пользователю
    }
  }
}
```

### ✅ All other flows have proper error handling:
1. Login/Register: Errors shown to user
2. Token refresh: Automatic with fallback logout
3. Logout: Always succeeds locally even if backend fails
4. Initialize: Silent failure (user not logged in)
5. Route protection: Automatic redirects

---

## Testing Scenarios

### Test 1: Invalid login
1. Enter wrong password
2. **Expected:** "Invalid credentials" shown in alert
3. **Actual flow:** Backend → useAuth → authStore → page → UI

### Test 2: Expired token during API call
1. Token expires (wait 15+ min)
2. Make API call (e.g., load todos)
3. **Expected:** Auto-refresh + request succeeds
4. **Actual flow:** API → 401 → Interceptor → refresh → retry

### Test 3: Expired refresh token
1. Clear cookies or wait 7 days
2. Make API call
3. **Expected:** Logout + redirect to /login
4. **Actual flow:** API → 401 → Interceptor → refresh fails → logout

### Test 4: Backend logout fails
1. Disable backend
2. Click logout
3. **Expected:** User still logged out locally + redirect
4. **Actual flow:** authStore.logout → error logged → finally block executes

---

## Conclusion

✅ **Полная цепочка обработки ошибок**
✅ **Все ошибки логируются или показываются**
✅ **Нет потерянных ошибок**
✅ **maxAge настраивается через .env**
✅ **useAuth правильно используется в store**

⚠️ **TODO:** Добавить обработку ошибок в TodoStore

