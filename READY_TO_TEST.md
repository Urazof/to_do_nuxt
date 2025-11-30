# Stage 5 - Ready to Test Checklist

## ✅ Все изменения завершены

### Backend (Server)
- ✅ `server/api/auth/login.post.ts` - Cookie с maxAge из .env
- ✅ `server/api/auth/register.post.ts` - Cookie с maxAge из .env  
- ✅ `server/api/auth/refresh.post.ts` - Читает из cookie, обновляет cookie
- ✅ `server/api/auth/logout.post.ts` - Удаляет cookie
- ✅ `server/utils/jwt.ts` - Функция `getRefreshTokenMaxAge()`

### Frontend (Client)
- ✅ `composables/useAuth.ts` - Composable с axios interceptors
- ✅ `stores/useAuthStore.ts` - Упрощен, использует useAuth (явный импорт)
- ✅ `stores/useTodoStore.ts` - Обработка ошибок + loading state
- ✅ `services/api/index.ts` - Использует useAuth.apiClient (явный импорт)
- ✅ `middleware/auth.global.ts` - Защита роутов
- ✅ `app.vue` - Инициализация auth
- ✅ `pages/login.vue` - Обработка ошибок (уже была)
- ✅ `pages/register.vue` - Обработка ошибок (уже была)

### Documentation
- ✅ `STAGE_5_COMPLETED.md` - Полная документация этапа
- ✅ `ERROR_HANDLING_FLOW.md` - Детальное описание flow
- ✅ `STAGE_5_FINAL_SUMMARY.md` - Итоговая сводка

### Code Quality
- ✅ Нет компиляционных ошибок
- ✅ Только warnings от IDE (ложные срабатывания)
- ✅ TypeScript везде
- ✅ Явные импорты где нужно
- ✅ Комментарии и документация

## 🔧 Перед запуском

### 1. Убедитесь что установлены зависимости:
```bash
npm install
# или
yarn install
```

### 2. Проверьте .env файл:
```env
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
REFRESH_SECRET=your-refresh-secret-key-change-in-production
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/todo_nuxt

# Environment
NODE_ENV=development
```

### 3. Запустите MongoDB:
```bash
# Если используете локальный MongoDB
mongod
```

## 🚀 Запуск для тестирования

```bash
npm run dev
```

Приложение должно запуститься на http://localhost:3000

## 🧪 Тестовый сценарий

### 1. Регистрация нового пользователя
- [ ] Открыть http://localhost:3000/register
- [ ] Ввести email и пароль (минимум 6 символов)
- [ ] Нажать Register
- [ ] **Ожидаемо:** Redirect на /login
- [ ] **Проверить в DevTools:** 
  - Application → Cookies → должна быть `refreshToken` с HttpOnly

### 2. Логин
- [ ] На странице /login ввести те же credentials
- [ ] Нажать Login
- [ ] **Ожидаемо:** Redirect на /todos
- [ ] **Проверить в DevTools:**
  - Network → последний запрос → Headers → Authorization: Bearer <token>

### 3. Работа с TODO
- [ ] Создать новый todo
- [ ] **Ожидаемо:** Todo появился в списке
- [ ] Отметить как выполненный
- [ ] **Ожидаемо:** Todo изменил вид
- [ ] Удалить todo
- [ ] **Ожидаемо:** Todo исчез из списка

### 4. Перезагрузка страницы
- [ ] Нажать F5 (перезагрузка)
- [ ] **Ожидаемо:** Остаетесь на /todos, todos загружаются
- [ ] **Это значит:** Refresh token работает, сессия восстановилась

### 5. Logout
- [ ] Нажать кнопку Logout
- [ ] **Ожидаемо:** Redirect на /
- [ ] **Проверить в DevTools:**
  - Application → Cookies → `refreshToken` удален
  - Application → Local Storage → userId и userEmail удалены

### 6. Попытка зайти на /todos без auth
- [ ] В адресной строке набрать http://localhost:3000/todos
- [ ] **Ожидаемо:** Автоматический redirect на /login

### 7. Тест ошибки логина
- [ ] На /login ввести неверный пароль
- [ ] Нажать Login
- [ ] **Ожидаемо:** Показывается alert с сообщением "Invalid credentials"

### 8. Тест ошибки регистрации
- [ ] На /register ввести уже существующий email
- [ ] Нажать Register
- [ ] **Ожидаемо:** Показывается alert с сообщением "Email already exists"

## 🐛 Если что-то не работает

### Проблема: "Cannot connect to MongoDB"
**Решение:** Убедитесь что MongoDB запущен и MONGODB_URI правильный

### Проблема: "Invalid or expired token"
**Решение:** 
1. Очистите cookies в DevTools
2. Очистите localStorage
3. Перезагрузите страницу
4. Попробуйте залогиниться снова

### Проблема: "useAuth is not defined"
**Решение:** Это не должно происходить т.к. добавлены явные импорты. Но если произошло:
1. Перезапустите dev server (Ctrl+C и npm run dev снова)
2. Очистите .nuxt папку: удалите .nuxt и перезапустите

### Проблема: Redirect loop между /login и /todos
**Решение:** 
1. Очистите cookies и localStorage
2. Перезагрузите страницу

## 📊 Что проверять в DevTools

### Network Tab
- [ ] Все запросы к /api/todos имеют header Authorization
- [ ] После 401 должен автоматически идти запрос к /api/auth/refresh
- [ ] После успешного refresh оригинальный запрос повторяется

### Application Tab - Cookies
- [ ] `refreshToken` присутствует после login/register
- [ ] `refreshToken` имеет флаг HttpOnly ✓
- [ ] `refreshToken` удаляется после logout

### Application Tab - Local Storage
- [ ] `userId` присутствует после login
- [ ] `userEmail` присутствует после login
- [ ] НЕ должно быть никаких токенов в localStorage

### Console Tab
- [ ] Нет красных ошибок при нормальной работе
- [ ] Могут быть логи типа "Failed to load todos" при ошибках (это нормально)

## ✅ Готово к продакшену когда:

- [ ] Все тесты выше прошли успешно
- [ ] В production .env установлены secure secrets (не "your-secret-key")
- [ ] NODE_ENV=production
- [ ] MongoDB URI указывает на production базу
- [ ] Написаны unit тесты для критических функций
- [ ] Написаны e2e тесты для основных сценариев

## 📝 Следующие шаги (опционально)

1. **Token Rotation** - Обновлять refresh token при каждом refresh
2. **Remember Me** - Опция для более долгой сессии
3. **Multi-tab sync** - Синхронизация auth между табами
4. **Rate limiting** - Ограничение частоты refresh запросов
5. **Token blacklist** - Серверная инвалидация токенов

---

**Статус:** ✅ READY TO TEST

**Дата:** 30.11.2025

**Stage:** 5 - Frontend Integration

**Разработчик:** GitHub Copilot

