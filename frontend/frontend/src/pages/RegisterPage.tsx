import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useRouter } from '@tanstack/react-router';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Введите имя пользователя и пароль!');
      return;
    }

    try {
      // TODO: Отправить запрос на API регистрации
      console.log('Отправка данных:', formData);

      // Если регистрация успешна — перенаправляем пользователя
      router.navigate({ to: '/login' });
    } catch (err) {
      setError('Ошибка регистрации, попробуйте снова.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#292626',
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 3,
          backgroundColor: '#292626',
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            color: '#333',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
          }}
        >
          Регистрация
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Имя пользователя"
          name="username"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Зарегистрироваться
        </Button>

        <Typography variant="body2" textAlign="center">
          Уже есть аккаунт?{' '}
          <Button
            variant="text"
            color="primary"
            onClick={() => router.navigate({ to: '/login' })}
          >
            Войти
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
