import { Box, Drawer, List, ListItemText, ListItemButton, Typography } from '@mui/material';

const MainPage = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1e545e' }}>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 200,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 70,
            boxSizing: 'border-box',
            bgcolor: '#14353b', 
            color: '#fff',
          },
        }}
      >
        <Typography 
        variant="h6" 
        textAlign="center" 
        sx={{ 
          mt: 1, 
          fontFamily: "Romaben"
        }}>
          LO
        </Typography>
        <List>
          {['Г', 'З', 'П'].map((text) => (
          <ListItemButton key={text}>
           <ListItemText primary={text} />
           </ListItemButton>
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
