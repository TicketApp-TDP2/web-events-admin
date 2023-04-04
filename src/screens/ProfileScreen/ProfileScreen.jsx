import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Button } from '@mui/material';
import { Profile } from "../../components/Profile"
import { EditProfile } from "../../components/EditProfile"
import EditIcon from '@mui/icons-material/Edit';
import { useState} from "react";

const person = {
  name: "John Doe",
  description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  image_url: "https://ath2.unileverservices.com/wp-content/uploads/sites/5/2016/12/estilos-de-mono-para-hombre-4.jpg",
  occupation: "Philanthropist",
}


export const ProfileScreen = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false)
  
  return <>
    <Box sx={{ display: 'flex' }}>
      <SideBar/>
      {!openEditProfile && (
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
            <Grid item style={{ flexGrow: "1" }}>
              <Typography variant="h3" sx={{ marginRight: 2}} color="primary">{person.name}</Typography>
            </Grid>
            <Grid xs={2} item>
              <Button variant="contained" size="large" color="secondary" startIcon={<EditIcon />} onClick={() => setOpenEditProfile(true)}>
                Editar
              </Button>
            </Grid>
          </Grid>
          <Divider variant="middle"/>
          <Profile/>
        </Box>
      )}
      {openEditProfile && (
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
            <Grid item style={{ flexGrow: "1" }}>
              <Typography variant="h3" sx={{ marginRight: 2}} color="primary">Editar perfil</Typography>
            </Grid>
          </Grid>
        <Divider variant="middle"/>
        <EditProfile/>
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ paddingTop: 5, paddingBottom: 2}}
        >
            <Button variant="contained" size="large" color="primary" onClick={() => setOpenEditProfile(false)} >
                Confirmar
            </Button>
        </Grid>
      </Box>
      )}
    </Box>
  </>
}