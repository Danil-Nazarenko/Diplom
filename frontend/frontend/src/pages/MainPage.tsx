import { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItemButton, Tooltip, Typography, TextField, Button, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { getTopics, createTopic } from '../api/topicsApi';

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
        <Typography
          variant="h6"
          sx={{
            mt: 1,
            fontFamily: 'Romaben',
          }}
        >
          LO
        </Typography>

        <List sx={{ mt: 2 }}>
          {menuItems.map((item, index) => (
            <Tooltip title={item.label} placement="right" key={index}>
              <ListItemButton sx={{ justifyContent: 'center' }}>
                {item.icon}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h6" color="#fff">
            Создать новую тему
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <TextField
              label="Название темы"
              variant="outlined"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
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
          <List>
            {themes.map((theme) => (
              <ListItemButton key={theme.id} sx={{ bgcolor: '#1b6c77', my: 1, borderRadius: 1 }}>
                <ListItemText primary={theme.title} primaryTypographyProps={{ color: '#fff' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default MainPage;
