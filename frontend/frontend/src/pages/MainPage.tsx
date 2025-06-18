import { useState, useEffect } from 'react';
import { Box, Drawer, List, Tooltip, Typography, TextField, Button, IconButton, Popover, ThemeProvider, createTheme,} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getTopics, createTopic } from '../api/topicsApi';
import { useRouter } from '@tanstack/react-router';
import { tasksRoute } from '../router/routes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Topic {
  id: number;
  title: string;
  deadline?: string;
  userId?: string;
}

const menuItems = [
  { label: 'Задачи', icon: <HomeIcon /> },
  { label: 'Календарь', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

const darkCalendarTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
    },
  },
});

const MainPage = () => {
  const [themes, setThemes] = useState<Topic[]>([]);
  const [newTheme, setNewTheme] = useState('');
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    if (!newTheme.trim() || !deadline) return;

    try {
      const created = await createTopic(newTheme.trim(), deadline.toISOString());
      setThemes(prev => [...prev, created]);
      setNewTheme('');
      setDeadline(null);
    } catch (error) {
      console.error('Ошибка при создании темы:', error);
    }
  };

  const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDatePicker = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'datepicker-popover' : undefined;

  const goToTasks = (topicId: number) => {
  router.navigate({ to: tasksRoute.to, params: { topicId } });
};
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
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

              <IconButton
                onClick={openDatePicker}
                sx={{
                  backgroundColor: '#14353b',
                  color: '#288394',
                  borderRadius: 1,
                  p: 1.5,
                  '&:hover': { backgroundColor: '#1b6c77' },
                }}
              >
                <CalendarMonthIcon />
              </IconButton>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={closeDatePicker}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {/* Оборачиваем календарь в темную тему */}
                <ThemeProvider theme={darkCalendarTheme}>
                  <Box sx={{ p: 2, bgcolor: '#1e1e1e' }}>
                    <DatePicker
                      value={deadline}
                      onChange={(newValue) => {
                        setDeadline(newValue);
                        closeDatePicker();
                      }}
                    />
                  </Box>
                </ThemeProvider>
              </Popover>

              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#14353b',
                  color: '#288394',
                  fontFamily: '"Poppins", XI20',
                  height: '56px',
                }}
                onClick={handleAddTheme}
                disabled={!newTheme.trim() || !deadline}
              >
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
    </LocalizationProvider>
  );
};

export default MainPage;
