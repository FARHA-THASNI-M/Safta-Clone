import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff000',
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

function PrivateRoute({ element }: { element: JSX.Element }) {
  // Check if the user is logged in by verifying localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // If logged in, render the element (Dashboard)
  return element;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Route for Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Protected Dashboard route */}
          <Route
            path="/dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
