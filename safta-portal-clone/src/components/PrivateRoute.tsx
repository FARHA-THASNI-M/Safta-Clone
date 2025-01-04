import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; // To define the element that should be rendered
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to login page if not logged in
  }

  return <>{element}</>; // Render the element (Dashboard in this case) if logged in
};

export default PrivateRoute;
