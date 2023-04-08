import { Grid, Button, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { FirebaseContext } from '../../index';
import { getAdditionalUserInfo } from "firebase/auth";
import { createOrganizer } from '../../services/organizerService';
import { UserContext } from '../../providers/UserProvider';

export const LandingScreen = () => {
    const firebaseContext = useContext(FirebaseContext);
    const { fetchUser } = useContext(UserContext);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const handleLogIn = async () => {
        signInWithPopup(firebaseContext.auth, firebaseContext.provider)
        .then((result) => {
            const additionalUserInfo = getAdditionalUserInfo(result)
            console.log("additionalUserInfo", additionalUserInfo);
            if (additionalUserInfo.isNewUser) {
                const newUser = {
                    firstName: additionalUserInfo.profile.given_name,
                    lastName: additionalUserInfo.profile.family_name,
                    email: additionalUserInfo.profile.email,
                    id: result.user.uid
                }
                console.log("creating new user in backend")
                createOrganizer(newUser).then((res) => {
                    console.log("OK backend", res);
                    setUserId(newUser.id);
                    fetchUser(newUser.id).then((r) => console.log("keep logged in"))
                }).catch((err) => console.log("ERROR backend: ", err));
            } else {
                setUserId(result.user.uid);
                fetchUser(result.user.uid).then((r) => console.log("logged in"))
            }
        }).catch((error) => {
            //Tirar un alert con el error
            console.log("error", error)
        });
        console.log("fetch user", userId);
    }

    async function fetchData() {
        if (userId) {
            await fetchUser(userId);
            navigate('events');
        }
    }

    useEffect(() => {
        fetchData();
    }, [userId])

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