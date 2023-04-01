
import { Stack, TextField } from "@mui/material";
import { useState } from "react";

const defaultValues = {
    title: '',
    date: '',
    type: '',
    location: '',
    //price: '',
    capacity: '',
    decription: '',
    images_urls: [{
        url: '/static/empty_image.jpg',
        default: true
    }],
    agenda: '',
    faqs: '',
};
export const NewEventForm = () => {

    const [eventData, setEventData] = useState(defaultValues);

    return <>
    <Stack spacing={2}>
        <TextField
            name="title"
            label="Nombre del evento"
            value={eventData.title}
            onChange={(event) => setEventData({...eventData, title: event.target.value})}
        />
        <TextField
            name="location"
            label="Ubicación"
            value={eventData.location}
            onChange={(event) => setEventData({...eventData, location: event.target.value})}
        />
    </Stack>
    </>
}