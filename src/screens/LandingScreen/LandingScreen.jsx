import { Grid, Button, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

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

export const LandingScreen = () => {
    
    const navigate = useNavigate();

    return <>
    <ThemeProvider theme={theme}>
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', m: 1}}
        >
            <Box sx={{ '& button': { m: 1 } }}>
                <div style={{ m: 5 }}>
                    <Button variant="outlined" size="large" color="primary" startIcon={<GoogleIcon />} onClick={() => navigate('events')}>
                    Ingresar con Google
                    </Button>
                </div>
                <div>
                    <Button variant="contained" size="large" color="primary" startIcon={<GoogleIcon />} onClick={() => navigate('events')}>
                    Registarse con Google
                    </Button>
                </div>
            </Box>
        </Grid>
      </ThemeProvider>
    </>
}