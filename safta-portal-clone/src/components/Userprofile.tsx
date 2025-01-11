import * as React from 'react';
import { Box, IconButton, Menu, Avatar, Typography, Modal, Backdrop } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

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
    <Box sx={{ display: 'flex', alignItems: 'center' , }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
      >
        <Avatar sx={{ 
          bgcolor: '#1a1a1a',
          width: 32,
          height: 32,
          fontSize: '1rem'
        }}>
          P
        </Avatar>
      </IconButton>
      <>
        <Backdrop
          open={open}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)', 
            zIndex: 1200
          }}
          onClick={handleClose}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'transparent'
            
            },
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              width: '280px',
              height: '100vh',
              maxWidth: '100%',
              right: 0,
              left: 'auto !important',
              position: 'fixed',
              '& .MuiMenu-list': {
                padding: 0,
                height: '100%',
              },
              bgcolor: '#f5f5f5',
              zIndex: 1300
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              pt: 6,
              px: 2,
              pb: 2,
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                padding: 0,
              }}
            >
              <Close fontSize="small" />
            </IconButton>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 'auto'
            }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#1a1a1a',
                  fontSize: '1.5rem',
                  mb: 2,
                }}
              >
                P
              </Avatar>
              
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Project Zoftcares
              </Typography>
              
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                }}
              >
                project@zoftcares.com
              </Typography>
            </Box>

            <Box
              onClick={handleLogout}
              sx={{
                width: '100%',
                py: 1.5,
                textAlign: 'center',
                cursor: 'pointer',
                color: 'white',
                background: 'linear-gradient(90deg, #009688 0%, #4CAF50 100%)',
                fontSize: '0.9rem',
                borderRadius: 0,
              }}
            >
              Logout
            </Box>
          </Box>
        </Menu>
      </>
    </Box>
  );
};

export default UserProfile;
