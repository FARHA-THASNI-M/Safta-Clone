
import { Box } from "@mui/material";
import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
const Dashboard:React.FC = () => {
  return (
    <Box display="flex">
      <Navbar />

      <Box  flex={1} display="flex" flexDirection="column">
        <Header pageTitle="Home"/>
      </Box>
    </Box>
  )
}

export default Dashboard;

