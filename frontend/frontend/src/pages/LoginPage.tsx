import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useRouter } from '@tanstack/react-router';
import { loginUser } from '../api/authApi';
import { saveAuth } from '../utils/authHelper';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loading) return;

    if (!formData.username || !formData.password) {
      setError('Введите имя пользователя и пароль!');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData.username, formData.password);

      saveAuth(data.token, data.userId); 

      router.navigate({ to: '/main' });
    } catch (err: any) {
      console.error('Ошибка входа:', err);
      setError(err.message || 'Ошибка входа, попробуйте снова.');
    } finally {
      setLoading(false);
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
          disabled={loading}
          sx={{
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
          disabled={loading}
          sx={{
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
          }}
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
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
            disabled={loading}
          >
            Зарегистрироваться
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
