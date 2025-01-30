import { NavigateFunction } from "react-router-dom";
import { logout } from "./authSlice";
import { AppDispatch } from "../lib/redux/store";

export const handleLogout = (
  dispatch: AppDispatch,
  navigate: NavigateFunction
) => {
  dispatch(logout());
  navigate("/login");
};
