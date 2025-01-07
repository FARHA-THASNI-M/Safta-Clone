import { Box } from "@mui/material";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Header = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');  
    }

    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
    return () => {
      window.onpopstate = null;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); 
    navigate('/login'); 
  };
  return (
    <Box sx={{
    }}>
        Header

      <button onClick={handleLogout}>Logout</button>
    </Box>
  )
}

export default Header;