import { Stack, TextField, Grid, Avatar, Badge } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';

const defaultValues = {
    name: "John Doe",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    image_url: "https://ath2.unileverservices.com/wp-content/uploads/sites/5/2016/12/estilos-de-mono-para-hombre-4.jpg",
    occupation: "Philanthropist",
}

export const EditProfile = () => {
    const [userData, setUserData] = useState(defaultValues);
    return <>
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Avatar alt={userData.name} src={userData.image_url} sx={{ width: 250, height: 250 }}/>
                </Badge>
            </Grid>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Nombre"
                    value={userData.name}
                    onChange={(event) => setUserData({...userData, name: event.target.value})}
                />
            </Stack>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Ocupación"
                    value={userData.occupation}
                    onChange={(event) => setUserData({...userData, occupation: event.target.value})}
                />
            </Stack>
            <Stack sx={{ pt: 2}}>
                <TextField
                    label="Descripción"
                    value={userData.description}
                    multiline
                    rows={4}
                    onChange={(event) => setUserData({...userData, description: event.target.value})}
                />
            </Stack>
        </Stack>
    </>
}