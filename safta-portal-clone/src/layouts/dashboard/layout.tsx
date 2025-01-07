import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export const DashboardLayout = () => {
    return (
        <Box>
            <Header/>
            <Sidebar/>
                <Outlet />

        </Box>
    );
};
