import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { handleLogout } from "./authUtils";

interface AuthState {
  isAuthenticated: boolean;
  userLoginName: string | null;
  userEmail: string | null;
  userToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  userLoginName: localStorage.getItem("userLoginName"),
  userEmail: localStorage.getItem("userEmail"),
  userToken: localStorage.getItem("userToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.userLoginName = null;
      state.userEmail = null;
      state.userToken = null;
      //   localStorage.removeItem("isAuthenticated");
      //   localStorage.removeItem("userLoginName");
      //   localStorage.removeItem("userEmail");
      //   localStorage.removeItem("userToken");
      handleLogout();
    },
    setCredentials: (state, action: PayloadAction<Partial<AuthState>>) => {
      const { userLoginName, userEmail, userToken } = action.payload;
      if (userLoginName) state.userLoginName = userLoginName;
      if (userEmail) state.userEmail = userEmail;
      if (userToken) state.userToken = userToken;
      state.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
      if (userLoginName) localStorage.setItem("userLoginName", userLoginName);
      if (userEmail) localStorage.setItem("userEmail", userEmail);
      if (userToken) localStorage.setItem("userToken", userToken);
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
