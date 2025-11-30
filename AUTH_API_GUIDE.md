# Руководство по использованию API аутентификации

## Обзор

Система аутентификации реализует JWT-based authentication с использованием access и refresh токенов.

## Endpoints

### 1. POST /api/auth/register

Регистрация нового пользователя.

**URL:** `http://localhost:3000/api/auth/register`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Error Responses:**

400 - Email and password are required
```json
{
  "statusCode": 400,
  "statusMessage": "Email and password are required"
}
```

400 - Password too short
```json
{
  "statusCode": 400,
  "statusMessage": "Password must be at least 6 characters"
}
```

400 - Email already exists
```json
{
  "statusCode": 400,
  "statusMessage": "Email already exists"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

**PowerShell Example:**
```powershell
$body = @{
    email = "user@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

### 2. POST /api/auth/login

Вход существующего пользователя.

**URL:** `http://localhost:3000/api/auth/login`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Error Responses:**

400 - Missing credentials
```json
{
  "statusCode": 400,
  "statusMessage": "Email and password are required"
}
```

401 - Invalid credentials
```json
{
  "statusCode": 401,
  "statusMessage": "Invalid credentials"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
// Сохраните токены для дальнейшего использования
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

---

### 3. POST /api/auth/refresh

Обновление access токена с помощью refresh токена.

**URL:** `http://localhost:3000/api/auth/refresh`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**Error Responses:**

400 - Missing refresh token
```json
{
  "statusCode": 400,
  "statusMessage": "Refresh token is required"
}
```

401 - Invalid or expired token
```json
{
  "statusCode": 401,
  "statusMessage": "Invalid or expired refresh token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
```

**JavaScript Example:**
```javascript
// Автоматическое обновление токена
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  }
  
  // Если не удалось обновить, выйти из системы
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}
```

---

## Использование токенов

### Отправка запросов с авторизацией

После получения access токена, включайте его в заголовок Authorization всех защищенных запросов:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**JavaScript Example:**
```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/todos', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

### Обработка истечения токена

Access токены истекают через 15 минут. Когда получаете 401 ошибку, используйте refresh токен для получения нового:

```javascript
async function fetchWithAuth(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');
  
  // Добавляем токен в заголовки
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`
  };
  
  let response = await fetch(url, options);
  
  // Если получили 401, пробуем обновить токен
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    
    // Повторяем запрос с новым токеном
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    response = await fetch(url, options);
  }
  
  return response;
}
```

---

## Конфигурация токенов

Настройки в `.env` файле:

```env
# Секретные ключи (ОБЯЗАТЕЛЬНО меняйте в production!)
JWT_SECRET=your-super-secret-jwt-key-for-development
REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Время жизни токенов
ACCESS_TOKEN_EXPIRES=15m    # 15 минут
REFRESH_TOKEN_EXPIRES=7d    # 7 дней
```

Поддерживаемые единицы времени:
- `s` - секунды
- `m` - минуты
- `h` - часы
- `d` - дни

Примеры: `30s`, `15m`, `2h`, `7d`

---

## Тестирование

### Запуск тестов

1. Убедитесь, что сервер запущен:
```bash
npm run dev
```

2. Запустите тестовый скрипт:
```bash
node test-auth.mjs
```

### Ручное тестирование

#### 1. Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 2. Вход
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 3. Обновление токена (используйте refreshToken из предыдущего ответа)
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN_HERE"}'
```

---

## Best Practices

### Хранение токенов

**Безопасно:**
- HttpOnly cookies (предотвращает XSS атаки)
- Secure flag для HTTPS
- SameSite flag для защиты от CSRF

**Менее безопасно (но удобно для SPA):**
- localStorage (используется в примерах)
- sessionStorage

### Обновление токенов

- Обновляйте access токен автоматически при получении 401
- Используйте interceptors в axios или middleware в fetch
- Не ждите истечения токена - обновляйте заранее

### Безопасность

1. **Всегда используйте HTTPS в production**
2. **Меняйте секретные ключи** в production
3. **Не храните пароли в открытом виде** (используется bcrypt)
4. **Добавьте rate limiting** для защиты от brute force
5. **Логируйте подозрительную активность**

---

## Структура токена

Декодированный JWT токен содержит:

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "type": "access",
  "iat": 1638360000,
  "exp": 1638360900
}
```

- `userId` - ID пользователя в MongoDB
- `type` - тип токена (`access` или `refresh`)
- `iat` - время создания (issued at)
- `exp` - время истечения (expiration)

---

## Troubleshooting

### Ошибка: "Invalid or expired token"
- Проверьте, что токен не истек
- Используйте refresh token для получения нового
- Убедитесь, что JWT_SECRET в .env совпадает с тем, что использовался при генерации

### Ошибка: "Email already exists"
- Пользователь с таким email уже зарегистрирован
- Используйте /api/auth/login для входа

### Ошибка: "Invalid credentials"
- Проверьте правильность email и пароля
- Email регистрозависимый

### Сервер не отвечает
- Убедитесь, что MongoDB запущена
- Проверьте MONGODB_URI в .env
- Проверьте, что сервер запущен на порту 3000

