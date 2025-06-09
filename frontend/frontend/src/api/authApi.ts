const AUTH_API_BASE_URL = 'http://localhost:5045/api/auth';

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Ошибка входа';
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      errorMessage = `Ошибка входа: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Здесь ожидается { token: string, userId: string }
  return await response.json();
};

export const registerUser = async (username: string, password: string, email: string) => {
  const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    let errorMessage = 'Ошибка регистрации';
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      errorMessage = `Ошибка регистрации: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Здесь ожидается { message: string, token: string, userId: string }
  return await response.json();
};
