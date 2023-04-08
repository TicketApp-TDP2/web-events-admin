import SideBar from '../../components/SideBar';
import { Typography, Box, Divider, Grid, Button, Stack, Avatar, Badge, TextField, Paper, IconButton, Modal, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useEffect, useContext } from "react";
import { updateOrganizer } from '../../services/organizerService';
import { UserContext } from "../../providers/UserProvider";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseContext } from '../../index';
import {v4} from 'uuid';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const defaultUser = {
  id: "",
  first_name: "",
  last_name: "",
  about_me: "",
  profile_picture: "",
  profession: "",
}

export const ProfileScreen = () => {
  const { user } = useContext(UserContext);
  const { fetchUser } = useContext(UserContext);
  const firebaseContext = useContext(FirebaseContext);

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [userData, setUserData] = useState(defaultUser);
  const [loadingImage, setLoadingImage] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
     if (errorMsg) {
       setOpenError(true);
     }
   }, [errorMsg]);

  function addImage(url) {
    setUserData({...userData, profile_picture: url});
  }
  
  async function uploadFile(file) {
    const storageRef = ref(firebaseContext.storage, 'images/' + v4());
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }
  
  const handleUpload = async (event) => {
    setLoadingImage(true);
    event.preventDefault();
    try {
        const urlImage = await uploadFile(event.target.files[0]);
        addImage(urlImage);
    } catch(e) {
        console.log(e);
    }
    setLoadingImage(false);
  }

  function ImageModal() {
    return (
        <Modal
            open={loadingImage}
            onClose={() => setLoadingImage(false)}
        >
            <Box sx={modalStyle}>
                <Typography variant="body1">
                    Aguarde un momento la imagen se está cargando...
                </Typography>
                <Grid sx={{display: 'flex'}} justifyContent="center" alignItems="center">
                    <CircularProgress color="inherit"/> 
                </Grid>
            </Box>
        </Modal>
    );
  }

  const handleSubmit = async () => {
    await updateOrganizer({
      first_name: userData.first_name,
      last_name: userData.last_name,
      profession: userData.profession,
      about_me: userData.about_me,
      profile_picture: userData.profile_picture,
      id: userData.id,
    }).then(async (response) => {
      await fetchUser(response.id);
      setOpenSuccess(true);
    }).catch((error) => {
      setErrorMsg(error);
      console.log(error)
    })
    setOpenEditProfile(false);
  }

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
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
      <ImageModal/>
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
                    badgeContent={
                      <div>
                      <input
                      type="file"
                      name=""
                      id="contained-button-file"
                      onChange={(event) => handleUpload(event)}
                      hidden
                      />
                      <label htmlFor="contained-button-file">
                          <IconButton 
                          component='span'
                          >
                              <CreateNewFolderIcon color='primary'/>
                          </IconButton>
                      </label>
                    </div>
                    }
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    
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
      <Modal
        open={openError}
        onClose={() => {
            setOpenError(false);
            setErrorMsg('');
        }}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: "#ff5252" }}
      >
        <Box sx={modalStyle}>
          <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ErrorOutlineIcon sx={{ color: "#ff5252", marginRight: 1 }}/>
            <Typography variant="h5">
              ¡Ocurrió un error!
            </Typography>
          </Grid>
          <Typography variant="body1">
            {errorMsg}
          </Typography>
        </Box>
      </Modal>
      <Modal
          open={openSuccess}
          onClose={() => setOpenSuccess(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box sx={modalStyle}>
          <Grid container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CheckCircleOutlineIcon sx={{ color: "#4caf50", marginRight: 1 }}/>
            <Typography variant="h5">
              ¡Éxito!
            </Typography>
          </Grid>
          <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            El perfil se ha actualizado correctamenta
          </Typography>
        </Box>
      </Modal>
    </Box>
  </>
}