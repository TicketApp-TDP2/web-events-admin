import { Grid, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

export const LandingScreen = () => {
    
    const navigate = useNavigate();

    return <>
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', m: 1}}
        >
            <img src="/Logo.png" alt="logo" />
            <Box sx={{ '& button': { m: 1, mt:2, } }}>
                <div>
                    <Button variant="contained" size="large" color="primary" startIcon={<GoogleIcon />} onClick={() => navigate('events')}>
                    Continuar con Google
                    </Button>
                </div>
            </Box>
        </Grid>
    </>
}