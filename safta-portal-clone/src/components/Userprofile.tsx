
import * as React from 'react';
import axios from 'axios';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
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

          <Avatar
            sx={{
              width: 64,
              height: 64,
              mb: 2,
              bgcolor: 'grey.800',
              fontSize: '1.5rem',
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
            Project Zoftcares
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
            }}
          >
            project@zoftcares.com
          </Typography>
          <Box
            sx={{
              width: '100%',
              mt: 1,
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
