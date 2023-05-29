import { Button, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SideBar from '../../components/SideBar';
import { EventsTable } from "../../components/EventsTable";

export const EventsScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            sx={{ alignItems: "center", padding: 2, minHeight: 40, justifyContent: "space-between" }}
          >
            <Grid item style={{ flexGrow: "1" }}>
              <Typography
                variant="h3"
                sx={{ marginRight: 2, marginLeft: 2 }}
                color="primary"
              >
                Eventos
              </Typography>
            </Grid>
            <Grid xs item style={{textAlign: 'right'}}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => navigate("/event/new")}
              >
                Agregar evento
              </Button>
            </Grid>
          </Grid>
          <EventsTable />
        </Box>
      </Box>
    </>
  );
};
