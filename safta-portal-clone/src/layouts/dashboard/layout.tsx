import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <Box>
        <Box>Header</Box>
        <Box>
            <Outlet/>
        </Box>
        <Box>Footer</Box>
    </Box>
  )
}
