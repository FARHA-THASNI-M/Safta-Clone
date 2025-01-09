import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
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
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function DashboardLayout() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const currentPage = menuItems.find(item => item.to === location.pathname)?.text ;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'flex-start', paddingLeft: 2 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ ml: 1 }}
          >
            {open ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              marginLeft: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {currentPage}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <button
            onClick={handleLogout}
            style={{
              marginLeft: open ? 'auto' : '0', 
              padding: '6px 12px',
              background: 'none',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
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

        <Divider />
        <List>
          {menuItems.map(({ text, to, icon }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={to}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    mr: open ? 3 : 'auto',
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
