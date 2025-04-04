import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { useRouter } from '@tanstack/react-router';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Все поля должны быть заполнены!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают!');
      return;
    }

    try {
      // TODO: Отправить данные на API регистрации
      console.log('Отправка данных:', formData);

      // После успешной регистрации — перенаправляем пользователя
      router.navigate({ to: '/dashboard' });
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
        color: 'white'
      }}
    >
      <Paper 
        elevation={10} 
        sx={{ 
          padding: 4, 
          width: 400, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          borderRadius: 3, 
          backgroundColor: '#292626',
        }}
      >
        {/* Логотип */}
        <Typography 
          variant="h3" 
          textAlign="center" 
          fontWeight="bold" 
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#E0E0E0',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
            marginBottom: 2,
          }}
        >
          LocOp
        </Typography>

        {/* Заголовок */}
        <Typography 
          variant="h4" 
          textAlign="center" 
          fontWeight="bold" 
          sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#E0E0E0',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          Регистрация
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {/* Поля ввода */}
        <TextField 
          label="Имя пользователя" 
          name="username"
          variant="outlined" 
          fullWidth 
          value={formData.username}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#B0B0B0' },
              '&:hover fieldset': { borderColor: '#E0E0E0' },
              '&.Mui-focused fieldset': { borderColor: '#E0E0E0' },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white', // Меняет цвет текста внутри поля
            },
          }}
        />
        <TextField 
          label="Email" 
          name="email"
          type="email" 
          variant="outlined" 
          fullWidth 
          value={formData.email}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#B0B0B0' },
              '&:hover fieldset': { borderColor: '#E0E0E0' },
              '&.Mui-focused fieldset': { borderColor: '#E0E0E0' },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white', // Меняет цвет текста внутри поля
            },
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
              '& fieldset': { borderColor: '#B0B0B0' },
              '&:hover fieldset': { borderColor: '#E0E0E0' },
              '&.Mui-focused fieldset': { borderColor: '#E0E0E0' },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white', // Меняет цвет текста внутри поля
            },
          }}
        />
        <TextField 
          label="Подтвердите пароль" 
          name="confirmPassword"
          type="password" 
          variant="outlined" 
          fullWidth 
          value={formData.confirmPassword}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#B0B0B0' },
              '&:hover fieldset': { borderColor: '#E0E0E0' },
              '&.Mui-focused fieldset': { borderColor: '#E0E0E0' },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white', // Меняет цвет текста внутри поля
            },
          }}
        />

        {/* Кнопка регистрации */}
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ 
            mt: 2, 
            backgroundColor: '#383836',
            fontFamily: '"Playfair Display", serif',
          }}
          onClick={handleSubmit}
        >
          Зарегистрироваться
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
