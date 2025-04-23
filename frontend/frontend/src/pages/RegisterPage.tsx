import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useRouter } from '@tanstack/react-router';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '', email: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.username || !formData.password || !formData.email) {
      setError('Заполните все поля!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5045/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Ошибка регистрации');
      }

      setSuccess('Регистрация прошла успешно! Перенаправление...');
      setTimeout(() => {
        router.navigate({ to: '/login' });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#14353b',
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
          backgroundColor: '#1e545e',
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          sx={{
            fontFamily: '"Poppins", XI20',
            color: '#000',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
          }}
        >
          Регистрация
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <TextField
          label="Имя пользователя"
          name="username"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          sx={textFieldStyle}
        />

        <TextField
          label="Электронная почта"
          name="email"
          type="email"
          variant="outlined"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          sx={textFieldStyle}
        />

        <TextField
          label="Пароль"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          sx={textFieldStyle}
        />

        <TextField
          label="Подтверждение пароля"
          name="confirmPassword"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.confirmPassword}
          onChange={handleChange}
          sx={textFieldStyle}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: '#14353b',
            color: '#288394',
            fontFamily: '"Poppins", XI20',
            mt: 2,
          }}
          onClick={handleSubmit}
        >
          Зарегистрироваться
        </Button>

        <Typography variant="body2" textAlign="center">
          Уже есть аккаунт?{' '}
          <Button
            variant="outlined"
            color="primary"
            sx={{
              color: '#000',
              fontFamily: '"Poppins", XI20',
              borderColor: '#0f272b',
              borderWidth: '2px',
            }}
            onClick={() => router.navigate({ to: '/' })}
          >
            Войти
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#09191c',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#000',
    },
  },
  '& label.Mui-focused': {
    color: '#000',
  },
};

export default RegisterPage;
