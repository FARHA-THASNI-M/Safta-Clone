import {
  Box,
  Button,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../services/auth/authService";
import { handleApiError } from "../../utils/errorHandler";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data).unwrap();
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
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            value={field.value || ""}
            variant="outlined"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
          />
        )}
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
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            type="password"
            variant="outlined"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
              },
            }}
          />
        )}
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
        onClick={handleSubmit(onSubmit)}
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
