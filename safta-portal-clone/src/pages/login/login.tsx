import { Box, Button, InputLabel, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        const requestData = {
            email: username,
            password: password
        };

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        try {
            const response = await axios.post('https://dev-portal.safta.sa/api/v1/auth/login?lang=en', requestData, { headers })
            if (response.status === 200) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/dashboard')
            } else {
                setError('incorrect')
            }
        } catch (error) {
            console.error(error);
            setError('Incorrect Email or Password');
        }
    };

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
            <Typography
                variant="h5"
                fontWeight="normal"
                gutterBottom
                sx={{
                    borderBottom: '3px solid black',
                    display: 'inline-block',
                    marginBottom: '35px'
                }}
            >
                Login
            </Typography>
            <InputLabel sx={{
                marginBottom: '-8px',
                fontSize: '14px',
                color: theme => theme.palette.primary.main,
            }}>Email</InputLabel>
            <TextField
                fullWidth
                label=""
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '14px'
                    }
                }}
            />
            <InputLabel sx={{
                marginBottom: '-8px',
                fontSize: '14px',
                color: theme => theme.palette.primary.main,
                marginTop: '15px'
            }}>Password</InputLabel>
            <TextField
                fullWidth
                label=""
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '14px'
                    }
                }}
            />
            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
            <Button
                fullWidth
                variant="contained"
                sx={{
                    marginTop: '20px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    textTransform: 'none'
                }}
                onClick={handleLogin}
            >
                Login
            </Button>
            <Link
                href="/forgot-password"
                onClick={handleForgotPassword}
                sx={{
                    display: 'block',
                    marginTop: '20px',
                    textAlign: 'left',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: 'black',
                    fontSize: '0.875rem'
                }}
            >
                Forgot username or password?
            </Link>
        </Box>
    );
};

export default Login;