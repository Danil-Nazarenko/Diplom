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
      console.log('Отправка данных:', formData);

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
        bgcolor: '#292626',
        color: 'white',
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
          Вход
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
            input: {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#B0B0B0',
              },
              '&:hover fieldset': {
                borderColor: '#E0E0E0',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
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
            input: {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#B0B0B0',
              },
              '&:hover fieldset': {
                borderColor: '#E0E0E0',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
          }}
        />

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
          Войти
        </Button>
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ 
            backgroundColor: '#383836',
            fontFamily: '"Playfair Display", serif',
          }}
            onClick={() => router.navigate({ to: '/register' })}
          >
            Зарегистрироваться
         </Button>
      </Paper>
    </Box>
  );
};

export default LoginPage;
