import {
  Box,
  Button,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Toast configuration
  const notifySuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "https://dev-portal.safta.sa/api/v1/auth/password-reset/request?lang=en",
        { email }
      );
      const message = response.data.message;
      notifySuccess(message);
      setResetSuccess(true);
    } catch (error) {
      console.error(error);
      setError("Failed to process password reset request");
    }
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
        Forgot password
      </Typography>

      <>
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
            },
          }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, mb: 3 }}>
          Enter the email address associated with your account and we'll send
          you a link to reset your password
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
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
          onClick={handleForgotPassword}
        >
          Continue
        </Button>

        {resetSuccess && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            A password reset link has been sent to the email:{" "}
            <strong>{email}</strong>
          </Typography>
        )}
      </>

      <Link
        onClick={() => navigate("/login")}
        sx={{
          display: "block",
          marginTop: "20px",
          textAlign: "left",
          textDecoration: "none",
          cursor: "pointer",
          color: "black",
          fontSize: "0.875rem",
        }}
      >
        Remember your password?
        <Typography
          component="span"
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Back to Login
        </Typography>
      </Link>
    </Box>
  );
};
