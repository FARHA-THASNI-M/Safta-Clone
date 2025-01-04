import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Prevent going back to dashboard using the browser's back button
  useEffect(() => {
    // Push a new state to the history stack when the component mounts
    window.history.pushState(null, '', window.location.href);
    
    // Listen for popstate event (back or forward button)
    window.onpopstate = () => {
      window.history.go(1); // Prevent going back
    };

    return () => {
      // Cleanup when the component is unmounted
      window.onpopstate = null;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear login status
    navigate('/'); // Redirect to login page
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
