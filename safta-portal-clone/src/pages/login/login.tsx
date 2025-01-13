import { Box, Button, InputLabel, Link, TextField, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import baseURL from '../../api/axios'
interface LoginResponse {
    message: string;
    data: {
        user: {

        token?: string;
        email?: string;
        login_name?: string; 
    }
    accessToken: string;
        }
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ email: '', password: '' });
    const [error, setError] = useState({ email: '', password: '' });
    
    const handleLogin = async () => {
        setError({ email: '', password: '' });
        let valid = true;
    
        if (!userData.email) {
            setError(prevError => ({ ...prevError, email: 'Email is required' }));
            valid = false;
        }
        if (!userData.password) {
            setError(prevError => ({ ...prevError, password: 'Password is required' }));
            valid = false;
        }
    
        if (!valid) return;
    
        const requestData = {
            email: userData.email,
            password: userData.password
        };
    
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    
        try {
            const response: AxiosResponse<LoginResponse> = await axios.post(
                'https://dev-portal.safta.sa/api/v1/auth/login?lang=en', 
                requestData, 
                { headers }
            );
    
            console.log('API Response:', response);
    
            console.log('API Response Data:', response.data); 
            console.log('API Response Data Data:', response.data.data); 
    
            if (response.data.data) {
                console.log('Login Name:', response.data.data.user.login_name); 
                console.log('Email:', response.data.data.user.email); 
                console.log('Token:', response.data.data.accessToken); 
            } else {
                console.log('No data found in response');
            }
    
            if (response.status === 200 && response.data.data) {
                console.log('Setting data in localStorage...');
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userLoginName', response.data.data.user.login_name || '');
                localStorage.setItem('userEmail', response.data.data.user.email || '');
                localStorage.setItem('userToken', response.data.data.accessToken || '');
    
                toast.success(response.data.message);
                navigate('/dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };
    
    

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
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
                }} >
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
                name="email"
                value={userData.email}
                onChange={handleChange}
                error={!!error.email}
                helperText={error.email}
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
                name="password"
                value={userData.password}
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '14px'
                    }
                }}
            />

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
                    textDecoration: 'underline',
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
