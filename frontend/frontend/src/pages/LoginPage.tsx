import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useRouter } from '@tanstack/react-router';

const LoginPage = () => {
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
      // TODO: Отправить запрос на API аутентификации
      console.log('Отправка данных:', formData);

      // Если успешный вход — перенаправляем пользователя
      router.navigate({ to: '/dashboard' });
    } catch (err) {
      setError('Ошибка входа, попробуйте снова.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#09191c',
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
          backgroundColor: '#14353b',
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
          Locus Operis
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Имя пользователя"
          name="username"
          variant="outlined"
          fullWidth
          value={formData.username}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#09191c',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#000',
              }
              },
              '& label.Mui-focused': {
                color: '#000',
            }
          }}
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#09191c',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#000',
              }
              },
              '& label.Mui-focused': {
                color: '#000',
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: '#09191c',
            color: '#1f525c',
            fontFamily: '"Poppins", XI20',
            mt: 2 
          }}
          onClick={handleSubmit}
        >
          Войти
        </Button>

        <Typography variant="body2" textAlign="center">
          <Button
            variant="outlined"
            color="primary"
            sx={{
              color: '#000',
              fontFamily: '"Poppins", XI20',
              borderColor: '#0f272b',
              borderWidth: '2px',
            }}
            onClick={() => router.navigate({ to: '/register' })}
          >
            Зарегистрироваться
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
