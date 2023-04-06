import { Grid, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import { FirebaseContext } from '../../index';
import { getAdditionalUserInfo } from "firebase/auth";
import { createUser } from '../../services/userService';
import { UserContext } from '../../providers/UserProvider';

export const LandingScreen = () => {
    
    const firebaseContext = useContext(FirebaseContext);
    const { fetchUser } = useContext(UserContext);

    const navigate = useNavigate();

    const handleLogIn = () => {
        signInWithPopup(firebaseContext.auth, firebaseContext.provider)
        .then((result) => {
          const additionalUserInfo = getAdditionalUserInfo(result)
          if (additionalUserInfo.isNewUser){
            const newUser = {
                firstName: additionalUserInfo.profile.given_name,
                lastName: additionalUserInfo.profile.family_name,
                email: additionalUserInfo.profile.email,
                birthDate: "2000-01-01",
                idNumber: result.user.uid,
                phoneNumber: "110001111",
            }
            createUser(newUser).then(async (res) => {
                await fetchUser(res.id);
                console.log("OK backend", res);
                navigate('events');
            }).catch((err) => console.log("ERROR backend: ", err));
          }
        }).catch((error) => {
            //Tirar un alert con el error
            console.log("error", error)
        });
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
                    <Button variant="contained" size="large" color="primary" startIcon={<GoogleIcon />} onClick={() => handleLogIn()}>
                    Continuar con Google
                    </Button>
                </div>
            </Box>
        </Grid>
    </>
}