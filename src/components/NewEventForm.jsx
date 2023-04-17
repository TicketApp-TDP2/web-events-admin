import { Stack, TextField, FormControl, Select,MenuItem, InputLabel, Grid, Typography, ImageList, ImageListItem, IconButton, Button, Box, Divider, CircularProgress, Modal } from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import {v4} from 'uuid';
import { createEvent } from "../services/eventService";
import { UserContext } from "../providers/UserProvider";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AutoComplete, {usePlacesWidget} from "react-google-autocomplete";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

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
    name: '',
    date: today,
    type: '',
    location: {},
    start_time: todayStartOfTheDay,
    end_time: todayStartOfTheDay,
    vacants: '',
    description: '',
    images_urls: [{
        url: '/static/Rectangle.png',
        default: true
    }],
    agenda: [],
    faqs: [],
};
const agendaDefaultValues = {
    time_init: todayStartOfTheDay,
    time_end: todayStartOfTheDay,
    owner: '',
    title: '',
    description: '',
}
const faqDefaultValues = {
    question: '',
    answer: '',
}
const locationDefaultValues = {
    description: '',
    lat: '',
    lng: '',
}
    
const types = {
    Arte_y_Cultura: "Arte y Cultura",
    Musica: "Música",
    Danza: "Danza",
    Moda: "Moda",
    Bellas_Artes: "Bellas Artes",
    Cine: "Cine",
    Turismo: "Turismo",
    Deporte: "Deporte",
    Gastronomia: "Gastronomía",
    Educacion: "Educación",
    Empresa: "Empresa",
    Capacitacion: "Capacitación",
    Entretenimiento: "Entretenimiento",
    Tecnologia: "Tecnología",
    Infantil: "Infantil",
    Debate: "Debate",
    Conmemoracion: "Conmemoración",
    Religion: "Religión",
    Convencion: "Convención",
}

export const NewEventForm = () => {

    const firebaseContext = useContext(FirebaseContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(defaultValues);
    const [agendaData, setAgendaData] = useState(agendaDefaultValues);
    const [locationData, setLocationData] = useState(locationDefaultValues);
    const [faqData, setFaqData] = useState(faqDefaultValues);
    const [loadingImage, setLoadingImage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(false);
    const [html, setHtml] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { ref: materialRef } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GEO_APIKEY,
        onPlaceSelected: (place) => {
            setLocationData({ description: place.formatted_address, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
        },
        // inputAutocompleteValue: "country",
        options: {
            componentRestrictions: { country: "ar" },
            types: ["address"]
        },
        defaultValue: eventData.location.description
    });

    // style={{ height: "50px", fontStyle: "Urbanist" }}

    useEffect(() => {
     console.log("useEffect");
      if (errorMsg) {
        console.log("hay error");
        setOpenError(true);
      }
    }, [errorMsg]);
    
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
    }

    async function uploadFile(file) {
        const storageRef = ref(firebaseContext.storage, 'images/' + v4());
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    }

    const handleSubmitImage = async (event) => {
        if(eventData.images_urls.length === 11){
            setErrorMsg("No se permiten subir mas de 10 imagenes!")
        } else {
            setLoadingImage(true);
            event.preventDefault();
            try {
                console.log(event.target.files)
                const urlImage = await uploadFile(event.target.files[0]);
                addImage(urlImage, false);
            } catch(e) {
                console.log(e);
                setErrorMsg(e);
            }
            setLoadingImage(false);
        }
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
        if(eventData.faqs.length === 30){
            setErrorMsg("No se permiten subir mas de 30 FAQs!")
        } else {
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
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleAddAgenda = () => {
        const newElement = {
            time_init: agendaData.time_init,
            time_end: agendaData.time_end,
            owner: agendaData.owner,
            title: agendaData.title,
            description: agendaData.description,
        };
        const newAgenda = eventData.agenda.slice();
        newAgenda.push(newElement);
        setEventData({...eventData, agenda: newAgenda})
        handleCloseModal();
    }

    const handleCreateEvent = async () => {
        setIsLoading(true);
        let newImages = eventData.images_urls.slice();
        newImages.shift();
        let previewImage = "";
        if (newImages.length > 0){
            newImages = newImages.map((image) => image.url);
            previewImage = newImages[0];
        }
        const newAgenda = []
        eventData.agenda.forEach(agenda => {
            let newElement = {
                time_init: agenda.time_init.format('HH:mm:ss'),
                time_end: agenda.time_end.format('HH:mm:ss'),
                owner: agenda.owner,
                title: agenda.title,
                description: agenda.description,
            }
            newAgenda.push(newElement);
        });
        console.log("location", locationData);
        const newValues = {
            name: eventData.name,
            date: eventData.date.format('YYYY-MM-DD'), 
            type: eventData.type,
            location: locationData,
            start_time: eventData.start_time.format('HH:mm:ss'),
            end_time: eventData.end_time.format('HH:mm:ss'),
            vacants: parseInt(eventData.vacants),
            description: html,
            images: newImages,
            preview_image: previewImage,
            organizer: user.id,
            agenda: newAgenda,
            FAQ: eventData.faqs,
        };
        console.log("newValues", newValues);
        await createEvent(newValues).then((result) => {
            setIsLoading(false);
            setOpenSuccess(true);
            navigate('/events');
            console.log("response", result)
        }).catch((error) => {
            setIsLoading(false);
            setErrorMsg(`${error.response.data.detail[0].loc[1]}: ${error.response.data.detail[0].msg}`);
            console.log("creation error", error)
        });
    }

    return <>
    <Stack spacing={2} sx={{ pl: 3, pr: 3 }}>
        <ImageModal />
        <Stack sx={{ pt: 2}}>
            <TextField
                label="Nombre del evento"
                value={eventData.name}
                onChange={(event) => setEventData({...eventData, name: event.target.value})}
            />
        </Stack>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container rowSpacing={1}>
                <Grid item xs>
                    <DatePicker
                    label="Elegir una fecha"
                    value={eventData.date}
                    onChange={(newValue) => setEventData({...eventData, date: newValue})}
                    format="DD/MM/YYYY"
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
                        ampm={false}
                    />
                </Grid>
                <Grid item xs>
                    <DesktopTimePicker
                        label="Horario fin"
                        value={eventData.end_time}
                        onChange={(newValue) => setEventData({...eventData, end_time: newValue})}
                        sx={{width: "100%"}}
                        ampm={false}
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
                        <MenuItem value={types.Arte_y_Cultura}>{types.Arte_y_Cultura}</MenuItem>
                        <MenuItem value={types.Musica}>{types.Musica}</MenuItem>
                        <MenuItem value={types.Danza}>{types.Danza}</MenuItem>
                        <MenuItem value={types.Moda}>{types.Moda}</MenuItem>
                        <MenuItem value={types.Bellas_Artes}>{types.Bellas_Artes}</MenuItem>
                        <MenuItem value={types.Cine}>{types.Cine}</MenuItem>
                        <MenuItem value={types.Turismo}>{types.Turismo}</MenuItem>
                        <MenuItem value={types.Deporte}>{types.Deporte}</MenuItem>
                        <MenuItem value={types.Gastronomia}>{types.Gastronomia}</MenuItem>
                        <MenuItem value={types.Educacion}>{types.Educacion}</MenuItem>
                        <MenuItem value={types.Empresa}>{types.Empresa}</MenuItem>
                        <MenuItem value={types.Capacitacion}>{types.Capacitacion}</MenuItem>
                        <MenuItem value={types.Entretenimiento}>{types.Entretenimiento}</MenuItem>
                        <MenuItem value={types.Tecnologia}>{types.Tecnologia}</MenuItem>
                        <MenuItem value={types.Infantil}>{types.Infantil}</MenuItem>
                        <MenuItem value={types.Debate}>{types.Debate}</MenuItem>
                        <MenuItem value={types.Conmemoracion}>{types.Conmemoracion}</MenuItem>
                        <MenuItem value={types.Religion}>{types.Religion}</MenuItem>
                        <MenuItem value={types.Convencion}>{types.Convencion}</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs>
                <TextField
                id="outlined-number"
                label="Vacantes"
                type="number"
                value={eventData.vacants}
                onChange={(event) => setEventData({...eventData, vacants: event.target.value})}
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
                inputRef={materialRef}
                name="location"
                label="Ubicación"
            />
        </Stack>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Descripción</Typography>
        <Stack spacing={2} mt={5}>
            <CKEditor
                editor={ ClassicEditor }
                data=""
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log( 'Editor is ready to use!', editor );
                    editor.editing.view.change((writer) => {
                        writer.setStyle(
                            "height",
                            "100px",
                            editor.editing.view.document.getRoot()
                        );
                    });
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setHtml(data);
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
            />
        </Stack>
        <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Galeria de Fotos</Typography>
        <Stack spacing={2} mt={5}>
            <ImageList sx={{ width: "100%", height: 350 }} cols={7} rowHeight={164}>
                {eventData.images_urls.map((item, idx) => (
                    <ImageListItem key={item.url}>
                        <img
                            src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            loading="lazy"
                        />
                        {item.default ? (
                            <div>
                                <Typography variant="subtitle1" color="primary" style={{ position: 'absolute', top: "50%", marginLeft: 15 }}>
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
                                value={agendaData.time_init}
                                onChange={(newValue) => setAgendaData({...agendaData, time_init: newValue})}
                                ampm={false}
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
                                value={agendaData.time_end}
                                onChange={(newValue) => setAgendaData({...agendaData, time_end: newValue})}
                                ampm={false}
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
                            value={agendaData.owner}
                            onChange={(event) => setAgendaData({...agendaData, owner: event.target.value})}
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
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Button variant="contained" size="large" onClick={() => handleAddAgenda()} >
                        Agregar
                    </Button>
                </Box>
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
                    {event.time_init.format('HH:mm')} - {event.time_end.format('HH:mm')}
                </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot />
                        {(eventData.agenda.length-1) !== idx && (<TimelineConnector />)}
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
                <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" size="large" onClick={() => handleAddFaq()}>
                        Agregar
                    </Button>
                </Box>
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
            {!isLoading && (
                <Button variant="contained" size="large" color="primary" onClick={handleCreateEvent}>
                    Crear Evento
                </Button>
            )}
            {isLoading && (
                <CircularProgress color="primary"/> 
            )}
        </Grid>
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
            <Typography variant="body1">
                El evento se ha creado correctamente
            </Typography>
        </Box>
      </Modal>
    </Stack>
    </>
}