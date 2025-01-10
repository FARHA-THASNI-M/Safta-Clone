import * as React from 'react';
import axios from 'axios';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AccountBalance, AccountCircle, Article, FileCopy, Groups3, Home, InsertLink, People } from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', to: '/dashboard', icon: <Home /> },
  { text: 'Working Groups', to: '/dashboard/working-groups', icon: <People /> },
  { text: 'Members', to: '/dashboard/members', icon: <AccountBalance /> },
  { text: 'Users', to: '/dashboard/users', icon: <AccountCircle /> },
  { text: 'Documents', to: '/dashboard/documents', icon: <FileCopy /> },
  { text: 'Meetings', to: '/dashboard/meetings', icon: <Groups3 /> },
  { text: 'News', to: '/dashboard/news', icon: <Article /> },
  { text: 'Links', to: '/dashboard/links', icon: <InsertLink /> }
];

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  height: '64px',
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const ProfileMenu = () => {
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
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 320,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
            mt: 1.5,
            '& .MuiList-root': {
              padding: 0,
            },
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
          }}
        >
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

export default function DashboardLayout() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const currentPage = menuItems.find(item => item.to === location.pathname)?.text;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between', paddingLeft: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
            >
              {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
              {currentPage}
            </Typography>
          </Box>
          <ProfileMenu />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open ? (
            <Box
              component="img"
              src="/images/logo.svg"
              alt="Logo 1"
              sx={{
                height: 40,
                width: 'auto',
                display: 'block',
                margin: '0 auto'
              }}
            />
          ) : (
            <Box
              component="img"
              src="/images/Logo1.png"
              alt="Logo 2"
              sx={{
                height: 40,
                width: 'auto',
                display: 'block',
                margin: '0 auto'
              }}
            />
          )}
        </DrawerHeader>
        <List>
          {menuItems.map(({ text, to, icon }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={to}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}