import { Button, Typography, Grid, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import SideBar from '../../components/SideBar';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SideBar from '../../components/SideBar';

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

export const EventsScreen = () => {
  const navigate = useNavigate();

  return <>
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <SideBar/>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
            <Grid item style={{ flexGrow: "1" }}>
              <Typography variant="h3" sx={{ marginRight: 2, marginLeft: 2 }}>Eventos</Typography>
            </Grid>
            <Grid xs={2} item>
              <Button variant="contained" size="large" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/event/new')}>
                Agregar evento
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  </>
}