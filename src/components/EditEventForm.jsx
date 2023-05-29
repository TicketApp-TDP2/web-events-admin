import { Stack, TextField, FormControl, Select,MenuItem, InputLabel, Grid, Typography, ImageList, ImageListItem, IconButton, Button, Box, CircularProgress, Modal } from "@mui/material";
import React, { useState, useContext } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {FirebaseContext, MobileNotificationsContext} from '../index';
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from '@mui/icons-material/Delete';
import {v4} from 'uuid';
import {getUsersEnrolled, updateEvent} from "../services/eventService";
import { UserContext } from "../providers/UserProvider";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {usePlacesWidget} from "react-google-autocomplete";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Agenda from './EditableAgenda';
import EditableFAQ from "./EditableFAQ";
import {rescheduleNotificationsForEvent, sendNotification, cancelScheduledNotificationsForEvent} from "../services/pushNotificationService";
import { ref as mobileRef } from 'firebase/database';
import moment from "moment/moment";

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

export default function EditEventForm(props) {
    const firebaseContext = useContext(FirebaseContext);
    const notificationsContext = useContext(MobileNotificationsContext);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(props.oldEvent);
    const [oldEvent, setOldEvent] = useState(props.oldEvent);
    const [locationData, setLocationData] = useState(props.oldEvent.location);
    const [loadingImage, setLoadingImage] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);
    const [html, setHtml] = useState(props.oldEvent.description);
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
                eventData.images.push(urlImage);
                setEventData(eventData)
                // addImage(urlImage, false);
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

    const notifyChanges = async (newValues) => {
        const dateChanged = (newValues.date !== oldEvent.date.format('YYYY-MM-DD'))
        const startTimeChanged = (newValues.start_time !== oldEvent.start_time.format('HH:mm:ss'))
        const locationChanged = (newValues.location.description !== oldEvent.location.description)
        const title = "¡Atención!";
        let body = `Ha habido cambios en tu evento. El evento ${oldEvent.name} se realizará `;

        if (dateChanged) {
            body = body + `el día ${newValues.date} `;
        }

        if (locationChanged) {
            body = body + `en ${newValues.location.description} `;
        }

        if (startTimeChanged) {
            body = body + `a las ${newValues.start_time}hs`;
        }

        if (startTimeChanged || dateChanged) {
            const newDate = `${newValues.date} ${newValues.start_time}`;
            const eventStartTime = moment(newDate);
            const dayBeforeEvent = eventStartTime.subtract(1, 'days');
            const sendAt = dayBeforeEvent.toString();
            cancelScheduledNotificationsForEvent(mobileRef(notificationsContext.db), oldEvent.id);
            rescheduleNotificationsForEvent(mobileRef(notificationsContext.db), oldEvent.id, sendAt, oldEvent.name);
        }

        if (!dateChanged && !locationChanged && !startTimeChanged) {
            body = `Ha habido cambios en el evento ${oldEvent.name}`;
        }

        const users = await getUsersEnrolled(oldEvent.id);
        users.forEach((userId) => {
            sendNotification(title, body, userId);
        })
    }

    const ConfirmModal = () => {
        return (
            <Modal
                open={confirmUpdate}
                onClose={() => setConfirmUpdate(false)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid',
                    borderRadius: 5,
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography>¿Estas seguro que deseas efectuar los cambios?</Typography>
                    <Typography>Se notificará a todos los usuarios inscriptos</Typography>
                    <Stack direction="row" justifyContent="space-between" mt={2}>
                        <Button color="error" variant="outlined" onClick={() => setConfirmUpdate(false)}>Cancelar</Button>
                        <Button color="primary" variant="outlined" onClick={handleUpdateEvent}>Confirmar</Button>
                    </Stack>
                </Box>
            </Modal>
        )
    }

    const handleUpdateEvent = async () => {
        setConfirmUpdate(false);
        setIsLoading(true);
        if (eventData.FAQ.length === 0) {
            Swal.fire({
                title: '¡Error!',
                text: "El evento debe contener FAQs",
                icon: 'error',
                confirmButtonColor: 'red',
            });
            setIsLoading(false);
            return;
        }
        if (eventData.agenda.length === 0) {
            Swal.fire({
                title: '¡Error!',
                text: "El evento debe contener una agenda",
                icon: 'error',
                confirmButtonColor: 'red',
            });
            setIsLoading(false);
            return;
        }
        if (eventData.images.length === 0) {
            Swal.fire({
                title: '¡Error!',
                text: "El evento debe contener al menos una imagen",
                icon: 'error',
                confirmButtonColor: 'red',
            });
            setIsLoading(false);
            return;
        }
        let newImages = eventData.images.slice();
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
        const newValues = {
            name: eventData.name,
            date: eventData.date.format('YYYY-MM-DD'),
            type: eventData.type,
            location: locationData,
            start_time: eventData.start_time.format('HH:mm:ss'),
            end_time: eventData.end_time.format('HH:mm:ss'),
            scan_time: parseInt(eventData.scan_time),
            vacants: parseInt(eventData.vacants),
            description: html,
            images: newImages,
            preview_image: newImages[0],
            organizer: user.id,
            agenda: newAgenda,
            FAQ: eventData.FAQ,
        };
        console.log("newValues", newValues);
        console.log("oldValues", oldEvent);
        await updateEvent(eventData.id, newValues).then((result) => {
            setIsLoading(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'El evento se ha actualizado correctamente',
                icon: 'success',
                confirmButtonColor: 'green',
            }).then(function() {
                notifyChanges(newValues);
                navigate(`/events/${eventData.id}`);
            });
            console.log("update response", result)
        }).catch((error) => {
            setIsLoading(false);
            let errorText = "";
            console.log("error detail", error.response.data.detail[0].type)
            if (error.response.data.detail.constructor === Array) {
                switch (error.response.data.detail[0].type) {
                    case "type_error.enum":
                        errorText = "El tipo de evento no es valido, seleccione algun tipo de la lista"
                        break;
                    case "value_error.number.not_ge":
                        errorText = "La cantidad de vacantes no puede ser nula, seleccione un valor"
                        break;
                    case "value_error.any_str.min_length":
                        switch (error.response.data.detail[0].loc[1]) {
                            case "name":
                                errorText = "El nombre del evento debe tener al menos 3 caracteres"
                                break;
                            case "location":
                                errorText = "La ubicación del evento debe tener al menos 3 caracteres"
                                break;
                            case "description":
                                errorText = "La descripción del evento debe tener al menos 3 caracteres"
                                break;
                            case "preview_image":
                                errorText = "Debe haber al menos una imagen del evento"
                                break;
                            default:
                                errorText = "Ocurrió un error inesperado. Porfavor vuelva a internar mas tarde"
                                break;
                        }
                        break;
                    default:
                        errorText = "Ocurrió un error inesperado. Porfavor vuelva a internar mas tarde"
                        break;
                }
            } else {
                switch (error.response.data.detail) {
                    case "agenda_can_not_be_empty":
                        errorText = "La agenda no puede estar vacia"
                        break;
                    case "agenda_can_not_have_empty_spaces":
                        errorText = "La agenda no puede tener espacios vacios"
                        break;
                    case "agenda_can_not_have_overlap":
                        errorText = "La agenda no puede tener superposicion de horarios entre dos eventos"
                        break;
                    case "agenda_can_not_end_after_event_end":
                        errorText = "La agenda no puede terminar despues del final del evento"
                        break;
                    default:
                        errorText = "Ocurrió un error inesperado. Porfavor vuelva a internar mas tarde"
                        break;
                }

            }
            Swal.fire({
                title: '¡Error!',
                text: errorText,
                icon: 'error',
                confirmButtonColor: 'red',
            });
            console.log("creation error", error);
        });
    }

    const updateOrConfirmEvent = () => {
        if (eventData.state === 'Publicado') {
            setConfirmUpdate(true);
            return;
        }
        handleUpdateEvent();
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
                    <TextField
                        id="outlined-number"
                        label="Tiempo previo para ingreso"
                        type="number"
                        value={eventData.scan_time}
                        onChange={(event) => setEventData({...eventData, scan_time: event.target.value})}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{width: "95%" }}
                        helperText="Con cuántas horas de anticipación quieres que se habilite la entrada al evento"
                    />
                </Grid>
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
            </Stack>
            <Agenda eventData={eventData} setEventData={setEventData}/>
            <EditableFAQ eventData={eventData} setEventData={setEventData}/>
            <ConfirmModal />
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ paddingTop: 10, paddingBottom: 2}}
            >
                {!isLoading && (
                    <Button variant="contained" size="large" color="primary" onClick={updateOrConfirmEvent}>
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