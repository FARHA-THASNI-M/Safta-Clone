import * as React from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const loginName = localStorage.getItem('userLoginName') || 'User';
  const email = localStorage.getItem('userEmail') || 'user@example.com';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userLoginName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleClick}
        size="small" 
        sx={{ ml: 2 }}    
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'grey.300'
          }}
        >
          {loginName.charAt(0).toUpperCase()} 
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 320,
            maxHeight: '100vh',
            overflow: 'hidden',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
            padding: 0,
            borderRadius: 0,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            height: '100vh',
            position: 'relative',
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              color: 'text.secondary',
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mb: 2,
                bgcolor: 'grey.800',
                fontSize: '1.5rem',
              }}
            >
              {loginName.charAt(0).toUpperCase()} 
            </Avatar>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              {loginName} 
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              {email} 
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                justifyContent: 'center',
                py: 1,
                px: 2,
                borderRadius: 1,
                bgcolor: 'Black',
                color: 'white',
              }}
            >
              Logout
            </MenuItem>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default UserProfile;
