import { Divider, Typography, Box } from '@mui/material';
import SideBar from '../../components/SideBar';
import { NewEventForm } from '../../components/NewEventForm';
//import { useNavigate } from 'react-router-dom';

export const NewEventScreen = () => {
    
    //const navigate = useNavigate();

    return <>
    <Box sx={{ display: 'flex' }}>
        <SideBar/>
        <Box component="main"
        sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h3" sx={{ marginRight: 2, marginLeft: 2, marginBottom:1 }} color="primary">Agregar Evento</Typography>
            <Divider variant="middle"/>
            <NewEventForm/>
        </Box>
    </Box>
    </>
}