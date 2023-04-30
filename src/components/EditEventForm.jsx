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
import {updateEvent} from "../services/eventService";
import { UserContext } from "../providers/UserProvider";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AutoComplete, {usePlacesWidget} from "react-google-autocomplete";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import Agenda from './EditableAgenda';

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

const today = dayjs();
const todayStartOfTheDay = today.startOf('day');
const agendaDefault = {
    time_init: todayStartOfTheDay,
    time_end: todayStartOfTheDay,
    owner: '',
    description: '',
    title: ''
};
const faqsDefault = {
    question: '',
    answer: ''
}

export default function EditEventForm(props) {
    const firebaseContext = useContext(FirebaseContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(props.oldEvent);
    const [agendaData, setAgendaData] = useState(agendaDefault);
    const [locationData, setLocationData] = useState(props.oldEvent.location);
    const [faqData, setFaqData] = useState(faqsDefault);
    const [loadingImage, setLoadingImage] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openFAQ, setOpenFAQ] = useState(false);
    const [html, setHtml] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { ref: materialRef } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GEO_APIKEY,
        onPlaceSelected: (place) => {
            setLocationData({ description: place.formatted_address, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
        },
        options: {
            componentRestrictions: { country: "ar" },
            types: ["address"]
        }
    });

    const handleTypeChange = (event) => {
        setEventData({...eventData, type: event.target.value});
    };

    function removeImage(idx) {
        setEventData({...eventData, images: eventData.images.filter((_, index) => index !== idx)})
    }

    function addImage(url, isDefault) {
        if (isDefault) {
            setEventData({...eventData, images: [...eventData.images, { url, default: true }]});
        }
        setEventData({...eventData, images: [...eventData.images, { url, default: false }]});
    }

    async function uploadFile(file) {
        const storageRef = ref(firebaseContext.storage, 'images/' + v4());
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return url;
    }

    function validateImageSize(image) {
        return image.size < 3000000;
    }

    const handleSubmitImage = async (event) => {
        if (eventData.images.length === 11) {
            Swal.fire({
                title: '¡Error!',
                text: "No se permiten subir mas de 10 imagenes",
                icon: 'error',
                confirmButtonColor: 'red',
            });
        } else {
            if (!validateImageSize(event.target.files[0])) {
                Swal.fire({
                    title: '¡Error!',
                    text: "El tamaño máximo permitido es de 3MB",
                    icon: 'error',
                    confirmButtonColor: 'red',
                });
                return;
            }
            setLoadingImage(true);
            event.preventDefault();
            try {
                console.log(event.target.files)
                const urlImage = await uploadFile(event.target.files[0]);
                addImage(urlImage, false);
            } catch(e) {
                console.log(e);
                let errorText = "";
                errorText = errorText.concat(e);
                Swal.fire({
                    title: '¡Error!',
                    text: errorText,
                    icon: 'error',
                    confirmButtonColor: 'red',
                });
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
        if (eventData.FAQ.length === 30) {
            Swal.fire({
                title: '¡Error!',
                text: "No se permiten subir mas de 30 FAQs",
                icon: 'error',
                confirmButtonColor: 'red',
            });
        } else {
            const newElement = {
                question: faqData.question,
                answer: faqData.answer,
            };
            const newFaq = eventData.FAQ.slice();
            newFaq.push(newElement);
            setEventData({...eventData, faqs: newFaq});
            setFaqData(eventData.FAQ);
            handleCloseFAQ();
        }
    }

    /*const handleOpenModal = () => {
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
        setEventData({...eventData, agenda: newAgenda});
        setAgendaData(eventData.agenda);
        handleCloseModal();
    }*/

    const handleUpdateEvent = async () => {
        setIsLoading(true);
        let newImages = eventData.images.slice();
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
            FAQ: eventData.FAQ,
        };
        console.log("newValues", newValues);
        /*await updateEvent(newValues).then((result) => {
            setIsLoading(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'El evento se ha creado correctamente',
                icon: 'success',
                confirmButtonColor: 'green',
            }).then(function() {
                navigate('/events');
            });
            console.log("response", result)
        }).catch((error) => {
            setIsLoading(false);
            let errorText = "Ocurrió un error."
            errorText = errorText.concat(` ${error.response.data.detail[0].loc[1]}: ${error.response.data.detail[0].msg}`);
            Swal.fire({
                title: '¡Error!',
                text: errorText,
                icon: 'error',
                confirmButtonColor: 'red',
            });
            console.log("creation error", error)
        });*/
    }

    /*const AgendaTimeline = ({event, idx}) => {
        return (
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
                    <TimelineContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography>{event.title}</Typography>
                            <Stack direction="row">
                                <Button><EditIcon fontSize="small"/></Button>
                                <Button><DeleteIcon fontSize="small"/></Button>
                            </Stack>
                        </Stack>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        )
    }*/

    const FAQAccordion = ({faq, idx}) => {
        return (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
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
                <Button><DeleteIcon fontSize="small" /></Button>
            </Stack>
        )
    }

    const AddFAQModal = () => {
        return (
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
        )
    }

    /*const AddAgendaModal = () => {
        const onChangeTimeInit = (newValue) => {
            console.log("lpm")
            setAgendaData({...agendaData, time_init: newValue})
        }
        const onChangeOwner = (newValue) => {
            console.log("lpm2")
            setAgendaData({...agendaData, owner: newValue.target.value})
        }

        return (
            <Modal
                open={openModal}
                onClose={handleCloseModal}
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
                    <Typography variant="h6" component="h2">
                        Agregar Agenda
                    </Typography>
                    <Divider/>
                    <Typography sx={{ mt: 2 }}>
                        Horario
                    </Typography>
                    <Grid container sx={{mt: 2}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={1}>
                                <Typography sx={{ mt: 2 }}>
                                    Desde:
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <DesktopTimePicker
                                    label="Horario inicio"
                                    value={agendaData.time_init}
                                    onChange={onChangeTimeInit}
                                    ampm={false}
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Typography sx={{ mt: 2 }}>
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
                            <Typography sx={{ mt: 2 }}>
                                Nombre
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <TextField
                                label="Responsable/Orador"
                                sx={{width: "100%"}}
                                value={agendaData.owner}
                                onChange={onChangeOwner}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{mt: 2}}>
                        <Grid item xs={3}>
                            <Typography sx={{ mt: 2 }}>
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
                            <Typography sx={{ mt: 2 }}>
                                Descripción
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <TextField
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
        )
    }*/

    const ImageViewer = () => {
        return (
            <ImageList sx={{ width: "100%", height: 350 }} cols={5} rowHeight={164} gap={20}>
                {eventData.images.map((item, idx) => (
                    <ImageListItem key={item}>
                        <img
                            src={`${item}?w=164&h=164&fit=crop&auto=format`}
                            srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                            alt=""
                            loading="lazy"
                        />
                        <IconButton style={{ position: 'absolute', top: "2%", left: "75%", backgroundColor: "white" }} onClick={() => removeImage(idx)}>
                            <DeleteIcon />
                        </IconButton>
                    </ImageListItem>
                ))}
                <ImageListItem style={{background: 'lightgrey'}}>
                    <Typography variant="subtitle1" color="primary" style={{ marginLeft: 15 }}>
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
                </ImageListItem>
            </ImageList>
        )
    }

    const EventTypeSelector = () => {
        return (
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
        )
    }

    const TimePickers = () => {
        return (
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
        )
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
            <TimePickers />
            <Grid container>
                <Grid item xs>
                    <EventTypeSelector />
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
                    defaultValue={eventData.location.description}
                />
            </Stack>
            <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Descripción</Typography>
            <Stack spacing={2} mt={5}>
                <CKEditor
                    editor={ ClassicEditor }
                    data={eventData.description}
                    onReady={ editor => {
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
                <ImageViewer />
            </Stack>
            {/*
            <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Agenda</Typography>
            <AddAgendaModal />
            {eventData.agenda.map((event, idx) => (
                <AgendaTimeline event={event} idx={idx} />
            ))}
            <Button variant="outlined" size="large" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>Agregar agenda</Button>
            */}
            <Agenda eventData={eventData} setEventData={setEventData}/>
            <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>FAQs</Typography>
            {eventData.FAQ.map((faq, idx) => (
                <FAQAccordion faq={faq} idx={idx} />
            ))}
            <Button variant="outlined" size="large" color="primary" onClick={handleOpenFAQ} startIcon={<AddIcon />}>Agregar FAQ</Button>
            {openFAQ && (
                <AddFAQModal />
            )}
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ paddingTop: 10, paddingBottom: 2}}
            >
                {!isLoading && (
                    <Button variant="contained" size="large" color="primary" onClick={handleUpdateEvent}>
                        Guardar
                    </Button>
                )}
                {isLoading && (
                    <CircularProgress color="primary"/>
                )}
            </Grid>
        </Stack>
    </>
}