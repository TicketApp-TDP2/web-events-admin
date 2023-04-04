import { Button, Typography, Grid, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SideBar from '../../components/SideBar';

export const EventsScreen = () => {
  const navigate = useNavigate();

  return <>
    <Box sx={{ display: 'flex' }}>
      <SideBar/>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
          <Grid item style={{ flexGrow: "1" }}>
            <Typography variant="h3" sx={{ marginRight: 2 }} color="primary">Eventos</Typography>
          </Grid>
          <Grid xs={2} item>
            <Button variant="contained" size="large" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/event/new')}>
              Agregar evento
            </Button>
          </Grid>
        </Grid>
        <Divider variant="middle"/>
      </Box>
    </Box>
  </>
}