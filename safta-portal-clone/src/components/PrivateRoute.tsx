import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  console.log('isAuthenticated:', isAuthenticated);  
  return isAuthenticated === 'true' ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
