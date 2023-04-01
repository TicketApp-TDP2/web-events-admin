import { Divider, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SideBar from '../../components/SideBar';
import { NewEventForm } from '../../components/NewEventForm';
//import { useNavigate } from 'react-router-dom';
//import SideBar from '../../components/SideBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#61309b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8978C7',
      contrastText: '#fff',
    },
    third: {
        main: '#94a5dd',
        contrastText: '#fff',
    },
  },
});

export const NewEventScreen = () => {
    
    //const navigate = useNavigate();

    return <>
    <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
            <SideBar/>
            <Box component="main"
            sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" sx={{ marginRight: 2, marginLeft: 2 }}>Agregar Evento</Typography>
                <Divider variant="middle"/>
                <NewEventForm/>
            </Box>
        </Box>
    </ThemeProvider>
    </>
}