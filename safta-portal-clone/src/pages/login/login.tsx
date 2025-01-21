import {
  Box,
  Button,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../services/auth/authService";
import { handleApiError } from "../../utils/errorHandler";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    setError({ email: "", password: "" });
    let valid = true;

    if (!userData.email) {
      setError((prevError) => ({ ...prevError, email: "Email is required" }));
      valid = false;
    }
    if (!userData.password) {
      setError((prevError) => ({
        ...prevError,
        password: "Password is required",
      }));
      valid = false;
    }

    if (!valid) return;

    const requestData = {
      email: userData.email,
      password: userData.password,
    };
    try {
      const response = await login(requestData).unwrap();
      if (response.data && response.data.user) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "userLoginName",
          response.data.user.login_name || ""
        );
        localStorage.setItem("userEmail", response.data.user.email || "");
        localStorage.setItem("userToken", response.data.accessToken || "");
        toast.success(response.message);
        navigate("/dashboard");
      } else {
        console.log("No data found in response");
      }
    } catch (error) {
      const errorMesssge = handleApiError(error);
      toast.error(errorMesssge);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "400px" }}>
      <Typography
        variant="h5"
        fontWeight="normal"
        gutterBottom
        sx={{
          borderBottom: "3px solid black",
          display: "inline-block",
          marginBottom: "35px",
        }}
      >
        Login
      </Typography>

      <InputLabel
        sx={{
          marginBottom: "-8px",
          fontSize: "14px",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Email
      </InputLabel>
      <TextField
        fullWidth
        label=""
        variant="outlined"
        margin="normal"
        name="email"
        value={userData.email}
        onChange={handleChange}
        error={!!error.email}
        helperText={error.email}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
          },
        }}
      />

      <InputLabel
        sx={{
          marginBottom: "-8px",
          fontSize: "14px",
          color: (theme) => theme.palette.primary.main,
          marginTop: "15px",
        }}
      >
        Password
      </InputLabel>
      <TextField
        fullWidth
        label=""
        type="password"
        variant="outlined"
        margin="normal"
        name="password"
        value={userData.password}
        onChange={handleChange}
        error={!!error.password}
        helperText={error.password}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{
          marginTop: "20px",
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "8px",
          fontWeight: "bold",
          textTransform: "none",
        }}
        onClick={handleLogin}
      >
        {isLoading ? "Loading" : "Login"}
      </Button>

      <Link
        href="/forgot-password"
        onClick={handleForgotPassword}
        sx={{
          display: "block",
          marginTop: "20px",
          textAlign: "left",
          textDecoration: "underline",
          cursor: "pointer",
          color: "black",
          fontSize: "0.875rem",
        }}
      >
        Forgot username or password?
      </Link>
    </Box>
  );
};

export default Login;
