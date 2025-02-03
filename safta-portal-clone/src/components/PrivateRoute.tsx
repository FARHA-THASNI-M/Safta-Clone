import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("isAuthenticated:", isAuthenticated);
  return isAuthenticated === "true" ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
