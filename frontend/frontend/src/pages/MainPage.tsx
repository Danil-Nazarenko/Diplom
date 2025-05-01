import { Box, Typography, Paper } from '@mui/material';

const MainPage = () => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        bgcolor: '#1e1e1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 8,
      }}
    >
      <Paper 
        elevation={4}
        sx={{
          p: 4,
          width: '90%',
          maxWidth: 800,
          borderRadius: 3,
          backgroundColor: '#2c2c2c',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Панель задач
        </Typography>
        <Typography variant="body1">
          Добро пожаловать! Здесь будет отображаться список ваших задач.
        </Typography>
        {/* Позже здесь будет: список задач, фильтры, кнопки и т.д. */}
      </Paper>
    </Box>
  );
};

export default MainPage;
