// import { NavigateFunction } from "react-router-dom";

export const handleLogout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("userLoginName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userToken");
  // navigate("/login");
};
