import { Stack, TextField, Grid, Typography, Button, Box, Divider, Modal } from "@mui/material";
import React, { useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const today = dayjs();
const todayStartOfTheDay = today.startOf('day');
const agendaDefault = {
    time_init: todayStartOfTheDay,
    time_end: todayStartOfTheDay,
    owner: '',
    description: '',
    title: ''
};

export default function Agenda({eventData, setEventData}) {
    const [agendaData, setAgendaData] = useState(agendaDefault);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState({show: false, event: eventData.agenda[0], idx: 0});

    const handleOpenModal = () => {
        setOpenModal(true);
    }
    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleAddAgenda = () => {
        // validate new start time is bigger than last one
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
    }

    const handleDeleteAgenda = (idx) => {
        eventData.agenda.splice(idx, 1);
        setEventData({...eventData});
    }

    const EditModal = () => {
        const [editAgenda, setEditAgenda] = useState(openEditModal.event)
        
        const handleAddEditedAgenda = () => {
            const idx = openEditModal.idx
            eventData.agenda.splice(idx, 1, editAgenda)
            setOpenEditModal({show: false, event: editAgenda, idx: 0});
        }

        const onChangeTimeInit = (newValue) => {
            setEditAgenda({...editAgenda, time_init: newValue})
        }
    
        const onChangeOwner = (newValue) => {
            setEditAgenda({...editAgenda, owner: newValue.target.value})
        }
    
        const onChangeTimeEnd = (newValue) => {
            setEditAgenda({...editAgenda, time_end: newValue})
        }
    
        const onChangeDescription = (newValue) => {
            setEditAgenda({...editAgenda, description: newValue.target.value})
        }
    
        const onChangeTitle = (newValue) => {
            setEditAgenda({...editAgenda, title: newValue.target.value})
        }

        return (
            <Modal
                open={openEditModal.show}
                onClose={() => setOpenEditModal({show: false, event: eventData, idx: 0})}
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
                        Editar Agenda
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
                                    value={editAgenda.time_init}
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
                                    value={editAgenda.time_end}
                                    onChange={onChangeTimeEnd}
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
                                value={editAgenda.owner}
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
                                value={editAgenda.title}
                                onChange={onChangeTitle}
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
                                value={editAgenda.description}
                                onChange={onChangeDescription}
                            />
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" marginTop={2}>
                        <Button variant="contained" size="large" onClick={() => handleAddEditedAgenda()} >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        )
    }

    const handleEditAgenda = (event, idx) => {
        setOpenEditModal({show: true, event, idx});
    }

    const AgendaTimeline = ({event, idx}) => {
        return (
            <>
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
                                    <Button onClick={() => handleEditAgenda(event, idx)}><EditIcon fontSize="small"/></Button>
                                    <Button onClick={() => handleDeleteAgenda(idx)}><DeleteIcon fontSize="small"/></Button>
                                </Stack>
                            </Stack>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            </>
        )
    }
    const onChangeTimeInit = (newValue) => {
        setAgendaData({...agendaData, time_init: newValue})
    }

    const onChangeOwner = (newValue) => {
        setAgendaData({...agendaData, owner: newValue.target.value})
    }

    const onChangeTimeEnd = (newValue) => {
        setAgendaData({...agendaData, time_end: newValue})
    }

    const onChangeDescription = (newValue) => {
        setAgendaData({...agendaData, description: newValue.target.value})
    }

    const onChangeTitle = (newValue) => {
        setAgendaData({...agendaData, title: newValue.target.value})
    }

    return (
        <>
            <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>Agenda</Typography>
            {eventData.agenda.map((event, idx) => (
                 <AgendaTimeline event={event} idx={idx} />
            ))}
            <EditModal />
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
                                    onChange={onChangeTimeEnd}
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
                                onChange={onChangeTitle}
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
                                onChange={onChangeDescription}
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
            <Button variant="outlined" size="large" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>Agregar agenda</Button>
        </>
    )
}