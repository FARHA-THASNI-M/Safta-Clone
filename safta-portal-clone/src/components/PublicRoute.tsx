import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("isAuthenticated:", isAuthenticated);
  return isAuthenticated === "true" ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
