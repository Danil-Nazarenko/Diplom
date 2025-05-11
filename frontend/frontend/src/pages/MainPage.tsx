import { Box, Drawer, List, ListItemButton, Tooltip, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

const menuItems = [
  { label: 'Главное', icon: <HomeIcon /> },
  { label: 'Задачи', icon: <AssignmentIcon /> },
  { label: 'Профиль', icon: <PersonIcon /> },
];

const MainPage = () => {
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
        <Typography variant="h4" color="#fff">
          Добро пожаловать!
        </Typography>
        <Typography variant="body1" color="#ccc">
          Это ваша главная страница.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainPage;
