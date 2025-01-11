import * as React from 'react';
import { Box, IconButton, Menu, Avatar, Typography } from '@mui/material';
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
        <Avatar sx={{ bgcolor: 'grey.800' }}>
          P
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
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
            borderRadius: 1,
            mt: 1.5,
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
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              color: 'text.secondary',
            }}
          >
            <Close />
          </IconButton>

          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'grey.800',
              fontSize: '2rem',
              mb: 2,
            }}
          >
            P
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
              mb: 3,
            }}
          >
            {email}
          </Typography>

          <Box
            onClick={handleLogout}
            sx={{
              width: '100%',
              py: 1.5,
              textAlign: 'center',
              cursor: 'pointer',
              color: 'white',
              borderRadius: 1,
              background: 'linear-gradient(90deg, #00796B 0%, #4CAF50 100%)',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            Logout
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

export default UserProfile;