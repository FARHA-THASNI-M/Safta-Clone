import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import  Dashboard  from './pages/dashboard/home';
import Users from './pages/dashboard/users';
import Documents from './pages/dashboard/documents';
import Links from './pages/dashboard/links';
import Meetings from './pages/dashboard/meetings';
import Members from './pages/dashboard/members';
import News from './pages/dashboard/news';
import Workinggroups from './pages/dashboard/workinggroups';
import Layout from './layouts/dashboard/layout';



const theme = createTheme({
  palette: {
    primary: {
      main: '#0000'
    },
    secondary: {
      main: '#333333'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Layout />} >
            <Route index element={<Dashboard/>}/>
            <Route path="abc" element={<div>abc</div>}/>
          </Route>
          <Route path="/users" element={<Users />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/links" element={<Links/>} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/members" element={<Members/>} />
          <Route path="/news" element={<News />} />
          <Route path="/workinggroups" element={<Workinggroups/>} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
