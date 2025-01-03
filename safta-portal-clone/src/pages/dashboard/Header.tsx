
import { TranslateRounded } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
/*
import { useNavigate } from "react-router-dom";
*/
interface HeaderProps {
    pageTitle: string;
}



const Header:React.FC<HeaderProps> = ({ pageTitle }) => {
 /*   const navigate = useNavigate();

    const handleBackClick = () => {
        if (window.history.state && window.history.state.idx > 0 ){
            navigate(-1);
        } else{
            navigate("/dashboard/home")
        }
    }

    */
  return (
    <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
            
            <Typography sx={{color:"black"}}>
                {pageTitle}
            </Typography>

            <Box>
                <IconButton color="inherit">
                    <TranslateRounded/>
                </IconButton>
                <IconButton color="inherit">
                    <TranslateRounded/>
                </IconButton>
            </Box>
        </Toolbar>
    </AppBar>

  )
}

export default Header;