import { Outlet } from '@tanstack/react-router';
import { Box, CssBaseline } from '@mui/material';

const Layout = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#292626'
      }}
    >
      <CssBaseline />
      <Outlet />
    </Box>
  );
};

export default Layout;
