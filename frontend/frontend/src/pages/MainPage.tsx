import { useState, useEffect } from 'react';
import { Box, Drawer, List, Tooltip, Typography, TextField, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { getTopics, createTopic } from '../api/topicsApi';
import { useRouter } from '@tanstack/react-router';
import { tasksRoute } from '../router/routes'; 

interface Topic {
  id: number;
  title: string;
  userId?: string;
}

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

const MainPage = () => {
  const [themes, setThemes] = useState<Topic[]>([]);
  const [newTheme, setNewTheme] = useState('');
  const router = useRouter(); 

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const data = await getTopics();
        setThemes(data);
      } catch (error) {
        console.error('Ошибка при загрузке тем:', error);
      }
    };
    fetchThemes();
  }, []);

  const handleAddTheme = async () => {
    if (!newTheme.trim()) return;

    try {
      const created = await createTopic(newTheme.trim());
      setThemes(prev => [...prev, created]);
      setNewTheme('');
    } catch (error) {
      console.error('Ошибка при создании темы:', error);
    }
  };

  const goToTasks = (topicId: number) => {
    router.navigate({ to: tasksRoute.to, params: { topicId: topicId.toString() } });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1e545e' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 70,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 70,
            boxSizing: 'border-box',
            bgcolor: '#14353b',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        <Typography variant="h6" sx={{ mt: 1, fontFamily: 'Romaben' }}>
          LO
        </Typography>

        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            <Tooltip title={item.label} placement="right" key={index}>
              <Box component="div" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {item.icon}
              </Box>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" color="#fff">Создать новую тему</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              label="Название темы"
              variant="outlined"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#09191c' },
                  '&.Mui-focused fieldset': { borderColor: '#000' },
                },
                '& label.Mui-focused': { color: '#000' },
              }}
            />
            <Button 
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#14353b',
                color: '#288394',
                fontFamily: '"Poppins", XI20',
                mt: 2
              }}
              onClick={handleAddTheme}>
              Добавить
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 0 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              mt: 1,
              fontFamily: 'Romaben',
            }}
          >
            Ваши темы:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="contained"
                sx={{
                  width: 'calc(50% - 8px)',
                  bgcolor: '#1b6c77',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontFamily: 'Poppins',
                  borderRadius: 2,
                  py: 2,
                  '&:hover': {
                    bgcolor: '#288394',
                  },
                }}
                onClick={() => goToTasks(theme.id)} 
              >
                {theme.title}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
