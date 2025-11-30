# Этап 2: Регистрация и аутентификация - ЗАВЕРШЕН ✅

## Реализованные функции

### 1. API Endpoints

#### POST /api/auth/register
Регистрация нового пользователя с хешированием пароля через bcrypt.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Валидация:**
- Email и password обязательны
- Password должен быть минимум 6 символов
- Email должен быть уникальным

#### POST /api/auth/login
Аутентификация пользователя с возвратом JWT токенов.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Валидация:**
- Email и password обязательны
- Проверка существования пользователя
- Проверка правильности пароля через bcrypt

#### POST /api/auth/refresh
Обновление access токена с помощью refresh токена.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Валидация:**
- Refresh token обязателен
- Верификация refresh токена
- Генерация новой пары токенов

### 2. Система токенов

#### Access Token
- **Срок жизни:** 15 минут (настраивается через `ACCESS_TOKEN_EXPIRES`)
- **Назначение:** Используется для авторизации API запросов
- **Secret:** `JWT_SECRET` из .env

#### Refresh Token
- **Срок жизни:** 7 дней (настраивается через `REFRESH_TOKEN_EXPIRES`)
- **Назначение:** Используется для обновления access токена
- **Secret:** `REFRESH_SECRET` из .env

#### Структура токена
```typescript
{
  userId: string,
  type: 'access' | 'refresh',
  iat: number,  // issued at
  exp: number   // expiration
}
```

### 3. Хеширование паролей

Используется **bcrypt** для безопасного хеширования паролей:
- Паролі хешируются автоматически в pre-save хуке модели User
- Salt rounds: 10
- Метод `comparePassword()` для проверки пароля при входе

### 4. Созданные файлы

#### server/utils/jwt.ts
Утилиты для работы с JWT токенами:
- `generateTokens(userId)` - генерация пары токенов
- `verifyAccessToken(token)` - верификация access токена
- `verifyRefreshToken(token)` - верификация refresh токена
- `parseExpiration(expiration)` - парсинг времени экспирации

#### server/api/auth/register.post.ts
Endpoint регистрации с полной валидацией

#### server/api/auth/login.post.ts
Endpoint входа с проверкой credentials

#### server/api/auth/refresh.post.ts
Endpoint обновления токенов

### 5. Конфигурация (.env)

```env
# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-for-development
REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Token Expiration
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# MongoDB
MONGODB_URI=mongodb://localhost:27017/todo_nuxt
```

### 6. Зависимости

Все необходимые пакеты уже установлены:
- `bcrypt` - для хеширования паролей
- `jsonwebtoken` - для работы с JWT
- `@types/bcrypt` - TypeScript типы для bcrypt
- `@types/jsonwebtoken` - TypeScript типы для jsonwebtoken

## Безопасность

### Реализованные меры безопасности:
1. ✅ Пароли хешируются с использованием bcrypt
2. ✅ Разделение access и refresh токенов
3. ✅ Короткий срок жизни access токенов (15 минут)
4. ✅ Длинный срок жизни refresh токенов (7 дней)
5. ✅ Разные секреты для разных типов токенов
6. ✅ Валидация всех входных данных
7. ✅ Проверка типа токена при верификации
8. ✅ Правильные HTTP коды ошибок (400, 401)

### Рекомендации для production:
1. Изменить `JWT_SECRET` и `REFRESH_SECRET` на сложные случайные строки
2. Хранить refresh токены в базе данных с возможностью отзыва
3. Добавить rate limiting для auth endpoints
4. Реализовать blacklist для отозванных токенов
5. Использовать HTTPS
6. Добавить CORS настройки
7. Логирование попыток входа

## Тестирование

### Примеры запросов

#### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Вход
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Обновление токена
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

## Следующие этапы

Этап 2 завершен. Можно переходить к:
- Этап 3: Защита API endpoints с использованием JWT middleware
- Этап 4: Интеграция с frontend (авторизация на клиенте)
- Этап 5: Расширенные функции (восстановление пароля, email верификация)

## Структура проекта

```
server/
├── api/
│   └── auth/
│       ├── register.post.ts    # Регистрация
│       ├── login.post.ts        # Вход
│       └── refresh.post.ts      # Обновление токенов
├── models/
│   └── User.ts                  # Модель с bcrypt хешированием
└── utils/
    └── jwt.ts                   # JWT утилиты
```

## Сборка и запуск

```bash
# Сборка проекта
npm run build

# Запуск в development режиме
npm run dev

# Предпросмотр production сборки
node .output/server/index.mjs
```

✅ **Этап 2 успешно завершен!**

