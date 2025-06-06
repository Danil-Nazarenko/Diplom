const API_URL = 'https://localhost:5045/api/auth';

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Ошибка входа');
  }

  return await response.json();
};

export const registerUser = async (username: string, password: string, email: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    throw new Error('Ошибка регистрации');
  }

  return await response.json();
};
