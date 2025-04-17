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
        background: '#09191c'
      }}
    >
      <CssBaseline />
      <Outlet />
    </Box>
  );
};

export default Layout;
