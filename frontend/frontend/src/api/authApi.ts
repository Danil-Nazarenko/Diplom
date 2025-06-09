// authApi.ts

// Базовый URL для ваших API-запросов аутентификации,
// соответствующий маршрутизации в AuthController ([Route("api/[controller]")])
const AUTH_API_BASE_URL = 'http://localhost:5045/api/auth';

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${AUTH_API_BASE_URL}/login`, { // Исправлен URL для логина
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Ошибка входа';
    try {
      // Пытаемся получить более конкретное сообщение об ошибке от сервера
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message; // Например, "Неверный логин или пароль"
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      // Если ответ не JSON или не может быть прочитан
      errorMessage = `Ошибка входа: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const registerUser = async (username: string, password: string, email: string) => {
  const response = await fetch(`${AUTH_API_BASE_URL}/register`, { // Исправлен URL для регистрации
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    let errorMessage = 'Ошибка регистрации';
    try {
      // Пытаемся получить более конкретное сообщение об ошибке от сервера
      const errorData = await response.json();
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // Для ошибок валидации (часто 400 Bad Request) ASP.NET Core может возвращать массив ошибок
        errorMessage = errorData.errors.map((err: any) => err.msg || err.description || err).join('; ');
      } else if (errorData.message) {
        errorMessage = errorData.message; // Например, "Пользователь с таким именем уже существует"
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      // Если ответ не JSON или не может быть прочитан
      errorMessage = `Ошибка регистрации: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
};