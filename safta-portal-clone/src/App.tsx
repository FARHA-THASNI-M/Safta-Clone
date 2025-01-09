import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate,  } from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/home';
import PrivateRoute from './components/PrivateRoute';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import {LoginLayout} from './layouts/login/layout';
import  DashboardLayout  from './layouts/dashboard/layout';
import Workinggroups from './pages/dashboard/workinggroups';
import Users from './pages/dashboard/users';
import News from './pages/dashboard/news';
import Meetings from './pages/dashboard/meetings';
import Members from './pages/dashboard/members';
import Links from './pages/dashboard/links';
import Documents from './pages/dashboard/documents';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff00',
    },
    secondary: {
      main: '#333333',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/dashboard/working-groups" element={<PrivateRoute element={<Workinggroups />} />} />
          <Route path="/dashboard/users" element={<PrivateRoute element={<Users />} />} />
          <Route path="/dashboard/news" element={<PrivateRoute element={<News />} />} />
          <Route path="/dashboard/meetings" element={<PrivateRoute element={<Meetings />} />} />
          <Route path="/dashboard/members" element={<PrivateRoute element={<Members />} />} />
          <Route path="/dashboard/links" element={<PrivateRoute element={<Links />} />} />
          <Route path="/dashboard/documents" element={<PrivateRoute element={<Documents />} />} />
          
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
