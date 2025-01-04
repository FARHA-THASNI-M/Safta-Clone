import React from 'react';
import {  Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; 
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" />; 
  }

  return <>{element}</>; 
};

export default PrivateRoute;
