
import { Stack, TextField, FormControl, Select,MenuItem, InputLabel, Grid, Typography, ImageList, ImageListItem, IconButton, Modal, Button, Box, Divider, CircularProgress } from "@mui/material";
import { useState, useContext } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { ref, uploadBytes, getDownloadURL, connectStorageEmulator } from 'firebase/storage';
import { FirebaseContext } from '../index';
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from '@mui/icons-material/Delete';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";
import { toHTML } from 'react-mui-draft-wysiwyg';
import {v4} from 'uuid';

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

const today = dayjs();
const todayStartOfTheDay = today.startOf('day');
const defaultValues = {
    title: '',
    date: today,
    type: '',
    location: '',
    start_time: todayStartOfTheDay,
    end_time: todayStartOfTheDay,
    //price: '',
    capacity: '',
    description: '',
    images_urls: [{
        url: '/static/Rectangle.png',
        default: true
    }],
    agenda: [],
    faqs: [],
};
const agendaDefaultValues = {
    start_time: todayStartOfTheDay,
    end_time: todayStartOfTheDay,
    responsable: '',
    title: '',
    description: '',
}
const faqDefaultValues = {
    question: '',
    answer: '',
}

export const NewEventForm = () => {

    const firebaseContext = useContext(FirebaseContext);

    const [eventData, setEventData] = useState(defaultValues);
    const [agendaData, setAgendaData] = useState(agendaDefaultValues);
    const [faqData, setFaqData] = useState(faqDefaultValues);
    const [openAddImageModal, setOpenAddImageModal] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(false);
    const [editorState, setEditorState] = useState(MUIEditorState.createEmpty());
    const [html, setHtml] = useState('');

    const onEditorChange = (newState) => {
        setEditorState(newState);
        setHtml(toHTML(newState.getCurrentContent()));
    }

    const handleTypeChange = (event) => {
        setEventData({...eventData, type: event.target.value});
    };

    function removeImage(idx) {
        setEventData({...eventData, images_urls: eventData.images_urls.filter((_, index) => index !== idx)})
    }

    function addImage(url, isDefault) {
        if (isDefault) {
            setEventData({...eventData, images_urls: [...eventData.images_urls, { url, default: true }]});
        }
        setEventData({...eventData, images_urls: [...eventData.images_urls, { url, default: false }]});
        setOpenAddImageModal(false);
    }

    async function uploadFile(file) {
        const storageRef = ref(firebaseContext.storage, 'images/' + v4());
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    }

    const handleSubmitImage = async (event) => {
        setLoadingImage(true);
        event.preventDefault();
        try {
            const urlImage = await uploadFile(event.target.files[0]);
            addImage(urlImage, false);
        } catch(e) {
            console.log(e);
            /*Swal.fire({
                title: 'Error!',
                text: 'Ocurrió un error. Intente nuevamente',
                icon: 'error',
                confirmButtonColor: 'red',
                timer: 100,
            })*/
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

    const handleOpenFAQ = () => {
        setOpenFAQ(true);
    }
    const handleCloseFAQ = () => {
        setOpenFAQ(false);
    }

    const handleAddFaq = () => {
        const newElement = {
            question: faqData.question,
            answer: faqData.answer,
        };
        const newFaq = eventData.faqs.slice();
        newFaq.push(newElement);
        setEventData({...eventData, faqs: newFaq});
        setFaqData(faqDefaultValues);
        handleCloseFAQ();
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleAddAgenda = () => {
        const newElement = {
            start_time: agendaData.start_time,
            end_time: agendaData.end_time,
            responsable: agendaData.responsable,
            title: agendaData.title,
            description: agendaData.description,
        };
        const newAgenda = eventData.agenda.slice();
        newAgenda.push(newElement);
        setEventData({...eventData, agenda: newAgenda})
        handleCloseModal();
    }

    const handleCreateEvent = () => {
        const newValues = {
            title: eventData.title,
            date: eventData.date, //pasar a string y fecha sin hora
            type: eventData.type,
            location: eventData.location,
            start_time: eventData.start_time, //pasar a string y formato hora min y AM/PM
            end_time: eventData.end_time, //pasar a string y formato hora min y AM/PM
            capacity: eventData.capacity,
            description: html,
            images_urls: eventData.images_urls, //sacar la primera url que es la default
            agenda: eventData.agenda, //para los campos de horarios: pasar a string y formato hora min y AM/PM
            faqs: eventData.faqs,
        };
    }

    return <>
    <Stack spacing={2} sx={{ pl: 3, pr: 3 }}>
        <ImageModal />
        <Stack sx={{ pt: 2}}>
            <TextField
                name="title"
                label="Nombre del evento"
                value={eventData.title}
                onChange={(event) => setEventData({...eventData, title: event.target.value})}
            />
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container rowSpacing={1}>
                <Grid item xs>
                    <DatePicker 
                    label="Elegir una fecha"
                    value={eventData.date}
                    onChange={(newValue) => setEventData({...eventData, date: newValue})}
                    slotProps={{
                        textField: {
                        helperText: 'MM / DD / AAAA',
                        },
                    }}
                    disablePast
                    sx={{width: "95%", pr:2}}
                    />
                </Grid>
                <Grid item xs>
                    <DesktopTimePicker
                        label="Horario inicio"
                        value={eventData.start_time}
                        onChange={(newValue) => setEventData({...eventData, start_time: newValue})}
                        sx={{width: "95%", pr:2}}
                    />
                </Grid>
                <Grid item xs>
                    <DesktopTimePicker
                        label="Horario fin"
                        value={eventData.end_time}
                        onChange={(newValue) => setEventData({...eventData, end_time: newValue})}
                        sx={{width: "100%"}}
                    />
                </Grid>
            </Grid>
        </LocalizationProvider>
        <Grid container>
            <Grid item xs>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={eventData.type}
                        label="Tipo"
                        onChange={handleTypeChange}
                        sx={{width: "95%", pr:2}}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs>
                <TextField
                id="outlined-number"
                label="Vacantes"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{width: "100%" }}
                />
            </Grid>
        </Grid>
        <Stack>
            <TextField
                name="location"
                label="Ubicación"
                value={eventData.location}
                onChange={(event) => setEventData({...eventData, location: event.target.value})}
            />
        </Stack>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Descripción</Typography>
        <Stack spacing={2} mt={5}>
            <MUIEditor editorState={editorState} onChange={onEditorChange} />
        </Stack>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Galeria de Fotos</Typography>
        <Stack spacing={2} mt={5}>
            <ImageList sx={{ width: 500, height: 350 }} cols={3} rowHeight={164}>
                {eventData.images_urls.map((item, idx) => (
                    <ImageListItem key={item.url}>
                        <img
                            src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            loading="lazy"
                        />
                        {item.default ? (
                            <div>
                                <Typography variant="subtitle1" color="primary" style={{ textAlign: "center", position: 'absolute', top: "30%" }}>
                                    Agregar nueva imagen
                                </Typography>
                                <input
                                type="file"
                                name=""
                                id="contained-button-file"
                                onChange={(event) => handleSubmitImage(event)}
                                hidden
                                />
                                <label htmlFor="contained-button-file">
                                    <IconButton style={{ position: 'absolute', top: "2%", left: "75%", backgroundColor: "white" }} 
                                    component='span'
                                    >
                                        <AddBoxIcon />
                                    </IconButton>
                                </label>
                            </div>
                        ) : (
                            <IconButton style={{ position: 'absolute', top: "2%", left: "75%", backgroundColor: "white" }} onClick={() => removeImage(idx)}>
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </ImageListItem>
                ))}
            </ImageList>
        </Stack>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Agenda</Typography>
        <Button variant="outlined" size="large" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>Agregar agenda</Button>
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Agregar Agenda
                </Typography>
                <Divider/>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Horario
                </Typography>
                <Grid container sx={{mt: 2}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={1}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Desde:
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <DesktopTimePicker
                                label="Horario inicio"
                                value={agendaData.start_time}
                                onChange={(newValue) => setAgendaData({...agendaData, start_time: newValue})}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Hasta:
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <DesktopTimePicker
                                label="Horario fin"
                                value={agendaData.end_time}
                                onChange={(newValue) => setAgendaData({...agendaData, end_time: newValue})}
                            />
                        </Grid>
                    </LocalizationProvider>
                </Grid>
                <Grid container sx={{mt: 2}}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Nombre
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label="Responsable/Orador"
                            sx={{width: "100%"}}
                            value={agendaData.responsable}
                            onChange={(event) => setAgendaData({...agendaData, responsable: event.target.value})}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{mt: 2}}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Titulo
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            label="Titulo"
                            sx={{width: "100%"}}
                            value={agendaData.title}
                            onChange={(event) => setAgendaData({...agendaData, title: event.target.value})}
                        />
                    </Grid>
                </Grid>
                <Grid container sx={{mt: 2}}>
                    <Grid item xs={3}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Descripción
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField
                            id="outlined-multiline-static"
                            label="Descripción"
                            multiline
                            sx={{width: "100%"}}
                            rows={4}
                            value={agendaData.description}
                            onChange={(event) => setAgendaData({...agendaData, description: event.target.value})}
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" size="large" onClick={() => handleAddAgenda()}>
                    Agregar
                </Button>
            </Box>
        </Modal>
        {eventData.agenda.map((event, idx) => (
            <Timeline
                sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                    flex: 0.2,
                },
                }}
            >
                <TimelineItem>
                <TimelineOppositeContent color="textSecondary">
                    {event.start_time.format('HH:mm A')} - {event.end_time.format('HH:mm A')}
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>{event.title}</TimelineContent>
                </TimelineItem>
            </Timeline>
        ))}
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>FAQs</Typography>
        <Button variant="outlined" size="large" color="primary" onClick={handleOpenFAQ} startIcon={<AddIcon />}>Agregar FAQ</Button>
        {openFAQ && (
            <>
                <TextField
                    label="Pregunta"
                    value={faqData.question}
                    onChange={(event) => setFaqData({...faqData, question: event.target.value})}
                />
                <TextField
                    label="Respuesta"
                    value={faqData.answer}
                    multiline
                    rows={4}
                    onChange={(event) => setFaqData({...faqData, answer: event.target.value})}
                />
                <Button variant="contained" size="large" onClick={() => handleAddFaq()}>
                    Agregar
                </Button>
            </>
        )}
        {eventData.faqs.map((faq, idx) => (
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{color: "white"}}/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{
                    backgroundColor: "#8978C7",
                  }}
                >
                <Typography color="white">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails
                sx={{ backgroundColor: '#e0e0e0' }}>
                <Typography >{faq.answer}</Typography>
                </AccordionDetails>
            </Accordion>
        ))}
        <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingTop: 10, paddingBottom: 2}}
        >
            <Button variant="contained" size="large" color="primary" onClick={handleCreateEvent}>
                Crear Evento
            </Button>
        </Grid>
    </Stack>
    </>
}