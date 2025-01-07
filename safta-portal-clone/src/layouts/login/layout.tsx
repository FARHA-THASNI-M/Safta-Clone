
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Typography } from "@mui/material";

export const Layout = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh' }}>
            <Box
                sx={{
                    flex: 3,
                    backgroundImage: 'url(/images/bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                <Box sx={{
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    filter: 'none',
                    borderRadius: 4,
                    padding: 4,
                    maxWidth: 500,
                    width: '100%',
                    mx: 2
                }}>
                    <Box
                        component="img"
                        src="/images/logo.svg"
                        alt="SAFTA Logo"
                        sx={{
                            width: '200px',
                            height: 'auto',
                            objectFit: 'contain',
                            mb: 3,
                        }}
                    />
                    <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
                        Welcome
                    </Typography>

                    <Typography variant="body2" color="black" sx={{ maxWidth: '90%', mx: 'auto' }}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};
