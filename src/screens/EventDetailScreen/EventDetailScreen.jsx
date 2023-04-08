import SideBar from "../../components/SideBar";
import {Box, Divider, Grid, Paper, Typography} from "@mui/material";
import { useParams } from 'react-router-dom';
import {useEffect, useState} from "react";
import {getEvent} from "../../services/eventService";


export function EventDetailScreen() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        async function fetchData() {
            getEvent(eventId).then((res) => setEvent(res.data));
        }
        fetchData();
    }, [])

    return (
        <Box sx={{ display: 'flex' }}>
            <SideBar/>
            {event && (
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Grid container sx={{ alignItems: "center", padding: 2, minHeight:40 }}>
                        <Grid item style={{ flexGrow: "1" }}>
                            <Typography variant="h3" sx={{ marginRight: 2}}>{event.name}</Typography>
                        </Grid>
                        <Divider variant="middle"/>
                        <Paper>

                        </Paper>
                    </Grid>
                </Box>
            )}
        </Box>
    )
}