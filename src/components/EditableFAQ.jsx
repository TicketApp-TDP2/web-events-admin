import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Stack, TextField, Typography, Button, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import React, { useState } from "react";

const faqsDefault = {
    question: '',
    answer: ''
}

export default function EditableFAQ({eventData, setEventData}) {
    const [openFAQ, setOpenFAQ] = useState(false);
    const [faqData, setFaqData] = useState(faqsDefault);

    const handleDeleteFaq = (idx) => {
        eventData.FAQ.splice(idx, 1);
        setEventData({...eventData});
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
            setEventData({...eventData, FAQ: newFaq});
            setFaqData(eventData.FAQ);
            handleCloseFAQ();
        }
    }

    const FAQAccordion = ({faq, idx}) => {
        return (
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <Accordion style={{width: '100%'}}>
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
                <Button onClick={() => handleDeleteFaq(idx)}><DeleteIcon fontSize="small" /></Button>
            </Stack>
        )
    }

    return (
        <>
            <Typography variant="h5" sx={{ marginRight: 2, marginLeft: 2 }}>FAQs</Typography>
            {eventData.FAQ.map((faq, idx) => (
                <FAQAccordion faq={faq} idx={idx} />
            ))}
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
         </>
    )
}