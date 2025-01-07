import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
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
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
