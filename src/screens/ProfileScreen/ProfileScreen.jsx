import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Button, Stack, Avatar, Badge, TextField, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect, useContext } from "react";
import { updateOrganizer } from '../../services/organizerService';
import { UserContext } from "../../providers/UserProvider";



const defaultUser = {
  first_name: "",
  last_name: "",
  about_me: "",
  profile_picture: "",
  profession: "",
}

//-----------------------------
function handleClick() {
  console.log('Badge clicked!');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = handleUpload;
  input.click();
}

function handleUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  console.log(`Uploading file ${file.name}...`);
  // Send the file to the server using axios
  /*
  const formData = new FormData();
  formData.append('file', file);

  axios.post('/upload-file', formData)
    .then(response => {
      console.log('File uploaded successfully!');
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
    */
  // firebase.storage.save().then((res) => {
    // await updateOrganizer(res.urlFirebase)
   //})
}
//-----------------------------


export const ProfileScreen = () => {
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [userData, setUserData] = useState(defaultUser);
  //const { user } = useContext(UserContext);
  const user = {
    first_name: "Lio",
    last_name: "Guglielmone",
    about_me:  "Im just a guy",
    profile_picture: "https://pbs.twimg.com/profile_images/1485050791488483328/UNJ05AV8_400x400.jpg",
    profession: "Maestro",
  } 
  const { userId } = "6waNhwioOiP1ZEXX8jyotCNT3Ao2";//user.id;


  const handleSubmit = async () => {
    await updateOrganizer(userId, userData);
    setOpenEditProfile(false);
  }

  useEffect(() => {
    if (user) {
      setUserData({
        first_name: user.first_name,
        last_name: user.last_name,
        about_me:  user.about_me,
        profile_picture: user.profile_picture,
        profession: user.profession,
      })
    }
  }, [user])
  
  
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
              <Typography variant="h3" sx={{ marginRight: 2}} color="primary">{userData.first_name} {userData.last_name}</Typography>
            </Grid>
            <Grid xs={2} item>
              <Button variant="contained" size="large" color="secondary" startIcon={<EditIcon />} onClick={() => setOpenEditProfile(true)}>
                Editar
              </Button>
            </Grid>
          </Grid>
          <Divider variant="middle"/>
            <Box sx={{ display: 'flex' }}>
              <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}>{userData.profession}</Typography>
              <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              paddingTop={10}
              >
                  <Grid item>
                      <Avatar alt={userData.first_name} src={userData.profile_picture} sx={{ width: 350, height: 350 }} />
                  </Grid>
                  <Grid item sx={{ paddingTop: 2}}>
                      <Paper elevation={10} sx={{ textAlign: 'center', backgroundColor: "#8978C7", lineHeight: '30px', padding: 2, width: "90%"}}>
                          <Typography variant="h4" color="#fff" sx={{marginBottom: 1}}>Sobre mi</Typography>
                          <Typography color="#fff">{userData.about_me}</Typography>
                      </Paper>
                  </Grid>
              </Grid>
            </Box>
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
        <Stack spacing={2} sx={{ pl: 3, pr: 3 }}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                paddingTop={5}
            >
                <Badge
                    overlap="circular"
                    badgeContent={<EditIcon/>}
                    color="primary"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClick={handleClick}
                >
                    <Avatar alt={userData.first_name} src={userData.profile_picture} sx={{ width: 250 , height: 250 }}/>
                </Badge>
            </Grid>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Nombre"
                    value={userData.first_name}
                    onChange={(event) => setUserData({...userData, first_name: event.target.value})}
                />
            </Stack>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Apellido"
                    value={userData.last_name}
                    onChange={(event) => setUserData({...userData, last_name: event.target.value})}
                />
            </Stack>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Ocupación"
                    value={userData.profession}
                    onChange={(event) => setUserData({...userData, profession: event.target.value})}
                />
            </Stack>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Sobre mi"
                    value={userData.about_me}
                    multiline
                    rows={4}
                    onChange={(event) => setUserData({...userData, about_me: event.target.value})}
                />
            </Stack>
        </Stack>
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ paddingTop: 5, paddingBottom: 2}}
        >
            <Button variant="contained" size="large" color="primary" onClick={handleSubmit} >
                Confirmar
            </Button>
        </Grid>
      </Box>
      )}
    </Box>
  </>
}