import AddIcon from '@mui/icons-material/Add';
import { Stack, TextField, Typography, Button, Box, ListItem, ListItemText, Grid, List, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import React, { useState } from "react";
import { addCollaborator, removeCollaborator } from '../services/eventService';

const collaboratorDefault = {
    collaborator_email: ''
}

export default function EditableCollaborators({eventData, setEventData}) {
    const [openCollaborator, setOpenCollaborator] = useState(false);
    const [collaboratorData, setCollaboratorData] = useState(collaboratorDefault);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteCollaborators = async (idx) => {
        //eventData.collaborators.splice(idx, 1);
        setIsLoading(true);
        const deletedElement = {
            id: eventData.id,
            collaborator_email: eventData.collaborators[idx].id,
        };
        console.log("deletedElement", deletedElement);
        //setEventData({...eventData});
        await removeCollaborator(deletedElement).then((result) => {
            console.log("result", result);
            setCollaboratorData(collaboratorDefault);
            setEventData(result);
            setIsLoading(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'El colaborador se ha eliminado correctamente',
                icon: 'success',
                confirmButtonColor: 'green',
            });
        }).catch((error) => {
            setCollaboratorData(collaboratorDefault);
            setIsLoading(false);
            Swal.fire({
                title: '¡Error!',
                text: 'Ocurrio un error',
                icon: 'error',
                confirmButtonColor: 'red',
            });
        });
    }

    const handleOpenCollaborators = () => {
        setOpenCollaborator(true);
    }
    const handleCloseCollaborators = () => {
        setOpenCollaborator(false);
    }

    const handleAddCollaborators = async () => {
        setIsLoading(true);
        const newElement = {
            id: eventData.id,
            collaborator_email: collaboratorData.collaborator_email,
        };
        console.log("newElement", newElement)
        //const newCollaborator = eventData.collaborators.slice();
        //newCollaborator.push(newElement);
        //setEventData({...eventData, collaborators: newCollaborator});
        await addCollaborator(newElement).then((result) => {
            setCollaboratorData(collaboratorDefault);
            //console.log("result add", result);
            setEventData(result);
            handleCloseCollaborators();
            setIsLoading(false);
            Swal.fire({
                title: '¡Éxito!',
                text: 'El colaborador se ha agregado correctamente',
                icon: 'success',
                confirmButtonColor: 'green',
            });
        }).catch((error) => {
            setCollaboratorData(collaboratorDefault);
            handleCloseCollaborators();
            setIsLoading(false);
            Swal.fire({
                title: '¡Error!',
                text: 'Ocurrio un error',
                icon: 'error',
                confirmButtonColor: 'red',
            });
        });
    }

    const CollaboratorsList = ({collaborator, idx}) => {
        return (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <List>
                    <ListItem
                    key={idx}
                    >
                    <ListItemText primary={`${collaborator.email}`} />
                    </ListItem>
                </List>
                <Button onClick={() => handleDeleteCollaborators(idx)}><DeleteIcon fontSize="medium" /></Button>
            </Stack>
        )
    }

    return (
        <>
            {isLoading && (
                <Grid sx={{display: 'flex', marginTop:2}} justifyContent="center" alignItems="center">
                    <CircularProgress color="primary"/>
                </Grid>
            )}
            {!isLoading && (
                <>
                {eventData.collaborators.length === 0 && (
                    <Typography variant="body1" sx={{ marginRight: 2, marginLeft: 2, marginTop: 1, marginBottom: 1 }}>
                        El evento no tiene colaboradores
                    </Typography>
                )}
                {eventData.collaborators.map((collaborator, idx) => (
                    <CollaboratorsList collaborator={collaborator} idx={idx} />
                ))}
                {!openCollaborator && (
                <Button fullWidth variant="outlined" size="large" color="primary" onClick={handleOpenCollaborators} startIcon={<AddIcon />}>Agregar Colaborador</Button>
                )}
                {openCollaborator && (
                    <>
                        <Box paddingBottom={2}>
                            <TextField
                                label="Email del colaborador"
                                value={collaboratorData.collaborator_email}
                                fullWidth
                                rows={4}
                                onChange={(event) => setCollaboratorData({...collaboratorData, collaborator_email: event.target.value})}
                            />
                        </Box>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" size="large" onClick={() => handleAddCollaborators()}>
                                Agregar
                            </Button>
                        </Box>
                    </>
                )}
                </>
            )}
         </>
    )
}