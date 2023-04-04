import { Typography, Box, Avatar, Grid, Paper } from '@mui/material';

const person = {
    name: "John Doe",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    image_url: "https://ath2.unileverservices.com/wp-content/uploads/sites/5/2016/12/estilos-de-mono-para-hombre-4.jpg",
    occupation: "Philanthropist",
}

export const Profile = () => {
  return <>
    <Box sx={{ display: 'flex' }}>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}>{person.occupation}</Typography>
        <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        paddingTop={10}
        >
            <Grid item>
                <Avatar alt={person.name} src={person.image_url} sx={{ width: 300, height: 300 }}/>
            </Grid>
            <Grid item sx={{ paddingTop: 2}}>
                <Paper elevation={10} sx={{ textAlign: 'center', backgroundColor: "#8978C7", lineHeight: '30px', padding: 2, width: "90%"}}>
                    <Typography variant="h4" color="#fff" sx={{marginBottom: 1}}>Sobre mi</Typography>
                    <Typography color="#fff">{person.description}</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Box>
  </>
}