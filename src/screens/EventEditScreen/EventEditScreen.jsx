import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getEvent} from "../../services/eventService";
import SideBar from "../../components/SideBar";
import {Box, Divider, Typography} from "@mui/material";
import EditEventForm from "../../components/EditEventForm";
import dayjs from "dayjs";

export default function EventEditScreen() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            getEvent(eventId).then((res) => {
                const agenda = res.data.agenda.map((a) => {
                    return {
                        ...a,
                        time_init: dayjs(`${res.data.date} ${a.time_init}`),
                        time_end: dayjs(`${res.data.date} ${a.time_end}`)
                    }
                })
                const oldEvent = {
                    ...res.data,
                    start_time: dayjs(`${res.data.date} ${res.data.start_time}`),
                    end_time: dayjs(`${res.data.date} ${res.data.end_time}`),
                    date: dayjs(res.data.date),
                    agenda: agenda
                }
                setEvent(oldEvent)
                setIsLoading(false);
            });
        }
        setIsLoading(true);
        fetchData();
    }, []);

    if (isLoading || !event) {
        return <></>
    }
console.log("El EVENTO",event)
    return(
        <Box sx={{ display: 'flex' }}>
            <SideBar/>
            <Box component="main"
                 sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" sx={{ marginRight: 2, marginLeft: 2, marginBottom:1 }} color="primary">Editar Evento</Typography>
                <Divider variant="middle"/>
                <EditEventForm oldEvent={event}/>
            </Box>
        </Box>
    )
}