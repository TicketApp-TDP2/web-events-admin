import SideBar from '../../components/SideBar';
import { Typography, Box } from '@mui/material';

export const ProfileScreen = () => {
    return <>
    <Box sx={{ display: 'flex' }}>
      <SideBar/>
        <Box component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Typography variant="h3" sx={{ marginRight: 2, marginLeft: 2 }}>Profile</Typography>
        </Box>
    </Box>
    </>
}