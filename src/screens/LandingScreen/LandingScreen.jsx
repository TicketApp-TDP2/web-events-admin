import { Grid, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { FirebaseContext } from '../../index';
import { GoogleAuthProvider } from "firebase/auth";

export const LandingScreen = () => {
    
    const firebaseContext = useContext(FirebaseContext);

    const navigate = useNavigate();

    const handleLogIn = () => {
        /*signInWithPopup(firebaseContext.auth, firebaseContext.provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          console.log("token", token);
          console.log("user", user);
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
        navigate('events');*/
    }

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
                    <Button variant="contained" size="large" color="primary" startIcon={<GoogleIcon />} onClick={() => handleLogIn}>
                    Continuar con Google
                    </Button>
                </div>
            </Box>
        </Grid>
    </>
}