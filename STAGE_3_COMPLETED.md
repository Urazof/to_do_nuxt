# ✅ Этап 3: Middleware для проверки токена - ЗАВЕРШЕН

**Дата завершения:** 30 ноября 2025

---

## 📋 Реализованные задачи

### 1. ✅ Middleware для верификации JWT
**Файл:** `server/utils/auth.ts`

**Что сделано:**
- ✅ Функция `requireAuth(event)` верифицирует JWT токен
- ✅ Декодирование токена через `verifyAccessToken()`
- ✅ Извлечение `userId` из payload токена
- ✅ **Прикрепление userId к `event.context.userId`** - ключевое изменение!
- ✅ Проверка формата Bearer токена
- ✅ Обработка ошибок (401 статус)

**Как это работает:**
```typescript
// В любом protected endpoint:
await requireAuth(event);

// После этого userId доступен автоматически:
const userId = event.context.userId;
```

---

### 2. ✅ Защита всех TODO endpoints

#### 📥 GET /api/todos
**Файл:** `server/api/todos/index.get.ts`

**Изменения:**
- ✅ Добавлен вызов `requireAuth(event)`
- ✅ userId теперь берется из `event.context.userId` (из токена)
- ❌ Удален query параметр `userId` (небезопасно)

**До:**
```typescript
const query = getQuery(event);
const userId = query.userId; // ❌ Можно подделать
```

**После:**
```typescript
await requireAuth(event);
const userId = event.context.userId; // ✅ Из верифицированного токена
```

---

#### 📤 POST /api/todos
**Файл:** `server/api/todos/index.post.ts`

**Изменения:**
- ✅ Добавлен вызов `requireAuth(event)`
- ✅ userId теперь берется из `event.context.userId`
- ❌ Удален userId из body (небезопасно)
- ✅ Добавлено значение по умолчанию `isDone = false`

**До:**
```typescript
const { userId } = await readBody(event); // ❌ Можно подделать
```

**После:**
```typescript
await requireAuth(event);
const userId = event.context.userId; // ✅ Из токена
```

---

#### ✏️ PUT /api/todos/[id]
**Файл:** `server/api/todos/[id].put.ts`

**Изменения:**
- ✅ Добавлен вызов `requireAuth(event)`
- ✅ userId берется из `event.context.userId`
- ✅ **КРИТИЧНО:** Проверка владельца задачи перед обновлением!
- ✅ Возврат 404 если задача не найдена или не принадлежит пользователю
- ✅ Правильная обработка ошибок

**Проверка владельца:**
```typescript
const todo = await Todo.findOne({ id, userId });
if (!todo) {
    throw createError({ 
        statusCode: 404, 
        message: 'Todo not found or access denied' 
    });
}
```

---

#### 🗑️ DELETE /api/todos/[id]
**Файл:** `server/api/todos/[id].delete.ts`

**Изменения:**
- ✅ Добавлен вызов `requireAuth(event)`
- ✅ userId берется из `event.context.userId`
- ✅ **КРИТИЧНО:** Проверка владельца задачи перед удалением!
- ✅ Возврат 404 если задача не найдена или не принадлежит пользователю
- ✅ Возврат подтверждения удаления

---

## 🔐 Улучшения безопасности

### До этапа 3:
❌ Клиент отправлял userId в запросе (query или body)
❌ Любой мог получить/изменить/удалить чужие задачи, подменив userId
❌ PUT/DELETE не проверяли владельца
❌ Токен не использовался для защиты TODO endpoints

### После этапа 3:
✅ userId извлекается ТОЛЬКО из верифицированного JWT токена
✅ Невозможно подделать userId - он берется из подписанного токена
✅ PUT/DELETE проверяют владельца перед изменением
✅ Все TODO endpoints защищены авторизацией
✅ Правильная обработка ошибок (401, 404)

---

## 🔍 Как работает защита

### Поток авторизации:

```
1. Клиент отправляет запрос:
   GET /api/todos
   Headers: { Authorization: "Bearer <JWT_TOKEN>" }

2. Handler вызывает requireAuth(event):
   ├─ Извлекает токен из заголовка
   ├─ Верифицирует подпись токена
   ├─ Декодирует payload (userId, exp)
   ├─ Записывает в event.context.userId
   └─ Возвращает { userId }

3. Handler использует userId:
   const todos = await Todo.find({ userId: event.context.userId })

4. Клиент получает только СВОИ задачи
```

### Проверка владельца (PUT/DELETE):

```
1. Клиент отправляет:
   PUT /api/todos/123
   Headers: { Authorization: "Bearer <TOKEN>" }

2. Handler:
   ├─ Верифицирует токен → userId = "user_A"
   ├─ Ищет задачу: Todo.findOne({ id: 123, userId: "user_A" })
   ├─ Если не найдена → 404 (задача не существует ИЛИ принадлежит другому)
   └─ Если найдена → обновляет

3. Результат:
   ✅ user_A может обновить только свою задачу
   ❌ user_A НЕ МОЖЕТ обновить задачу user_B
```

---

## 📝 Использование в коде

### В protected endpoint:

```typescript
import { requireAuth } from '@/server/utils/auth';

export default defineEventHandler(async (event) => {
    // Обязательная авторизация
    await requireAuth(event);
    
    // userId доступен автоматически
    const userId = event.context.userId;
    
    // Используем в запросах к БД
    const todos = await Todo.find({ userId });
    
    return { todos };
});
```

### С проверкой владельца:

```typescript
export default defineEventHandler(async (event) => {
    await requireAuth(event);
    const userId = event.context.userId;
    const id = event.context.params?.id;
    
    // Проверяем владельца
    const todo = await Todo.findOne({ id, userId });
    if (!todo) {
        throw createError({ 
            statusCode: 404, 
            message: 'Todo not found or access denied' 
        });
    }
    
    // Безопасно обновляем
    todo.isDone = true;
    await todo.save();
    
    return { todo };
});
```

---

## 🧪 Тестирование

### Ручное тестирование:

```bash
# 1. Регистрация пользователя
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Ответ: { "accessToken": "...", "refreshToken": "..." }

# 2. Создание задачи (с токеном)
curl -X POST http://localhost:3000/api/todos \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","isDone":false}'

# 3. Получение задач (с токеном)
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# 4. Попытка без токена (должен вернуть 401)
curl -X GET http://localhost:3000/api/todos
# Ответ: { "statusCode": 401, "message": "Authorization header is required" }
```

### Тестирование проверки владельца:

```bash
# 1. Создать пользователя A и задачу
# 2. Создать пользователя B
# 3. Попытаться удалить задачу A токеном пользователя B

curl -X DELETE http://localhost:3000/api/todos/<TODO_ID> \
  -H "Authorization: Bearer <USER_B_TOKEN>"

# Ожидаемый результат: 404 Todo not found or access denied
```

---

## 🎯 Результат

### Было (До этапа 3):
```typescript
// ❌ НЕБЕЗОПАСНО
GET /api/todos?userId=123
POST /api/todos { title: "...", userId: "123" }
```

### Стало (После этапа 3):
```typescript
// ✅ БЕЗОПАСНО
GET /api/todos
Headers: { Authorization: "Bearer <token>" }

// userId извлекается из токена автоматически
```

---

## 📊 Статистика изменений

| Файл | Строк изменено | Описание |
|------|----------------|----------|
| `server/utils/auth.ts` | +2 | Добавлена запись в event.context |
| `server/api/todos/index.get.ts` | ~10 | Добавлена защита, удален query userId |
| `server/api/todos/index.post.ts` | ~12 | Добавлена защита, удален body userId |
| `server/api/todos/[id].put.ts` | ~20 | Добавлена защита + проверка владельца |
| `server/api/todos/[id].delete.ts` | ~18 | Добавлена защита + проверка владельца |

**Всего:** 5 файлов изменено, ~62 строки кода

---

## 🚀 Что дальше?

### Этап 3 полностью завершен! ✅

Теперь все TODO endpoints:
- ✅ Защищены JWT авторизацией
- ✅ Получают userId из верифицированного токена
- ✅ Проверяют владельца при изменении/удалении
- ✅ Возвращают правильные HTTP статусы

### Возможные улучшения (опционально):

1. **Rate Limiting** - ограничение количества запросов
2. **Логирование** - запись попыток доступа
3. **Глобальный middleware** - автоматическая защита маршрутов
4. **Unit тесты** - для функций авторизации
5. **E2E тесты** - для защищенных endpoints

---

## 📚 Документация

### Связанные файлы:
- [AUTH_API_GUIDE.md](./AUTH_API_GUIDE.md) - API авторизации
- [STAGE_1_COMPLETED.md](./STAGE_1_COMPLETED.md) - JWT утилиты
- [STAGE_2_COMPLETED.md](./STAGE_2_COMPLETED.md) - Auth endpoints

### Ключевые концепции:
- **event.context** - объект для передачи данных между middleware и handlers
- **requireAuth** - функция для обязательной авторизации
- **Ownership check** - проверка владельца ресурса перед операциями

---

**Автор:** GitHub Copilot  
**Дата:** 30 ноября 2025  
**Версия:** 1.0

