import SideBar from "../../components/SideBar";
import {
  Box,
  Grid,
  ImageListItem,
  Paper,
  Typography,
  ImageList,
  Button,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import {getEvent, getUsersEnrolled} from "../../services/eventService";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Timeline from "@mui/lab/Timeline";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import GoogleMap from "google-maps-react-markers";
import Marker from "../../components/MapMarker";
import parse from "html-react-parser";
import { State } from "../../components/State";
import { useNavigate } from "react-router-dom";
import { publishEvent, cancelEvent } from "../../services/eventService";
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/joy/Stack';
import {MobileNotificationsContext} from "../../index";
import { ref } from 'firebase/database';
import {cancelScheduledNotificationsForEvent, sendNotification} from "../../services/pushNotificationService";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EventsScreen } from "../EventsScreen/EventsScreen";
import EditableCollaborators from "../../components/EditableCollaborators";

dayjs.extend(customParseFormat);

export function EventDetailScreen() {
  const notificationsContext = useContext(MobileNotificationsContext);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [imagePage, setImagePage] = useState(0);

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const editableStates = ['Publicado', 'Borrador'];

  const handlePublishEvent = async () => {
    setIsLoading(true);

    await publishEvent(eventId)
      .then((result) => {
        setIsLoading(false);
        Swal.fire({
          title: '¡Éxito!',
          text: 'El evento se ha publicado correctamente',
          icon: 'success',
          confirmButtonColor: 'green',
        }).then(function() {
          navigate("/events");
        });
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoading(false);
        let errorText = "Ocurrió un error."
        errorText = errorText.concat(` ${error.response.data.detail}`);
        Swal.fire({
          title: '¡Error!',
          text: errorText,
          icon: 'error',
          confirmButtonColor: 'red',
        });
        console.log("publish error", error);
      });
  };

  const notifyUsers = async () => {
    const title = "Información importante";
    const body = `El evento ${event.name} ha sido cancelado.`;
    const users = await getUsersEnrolled(eventId);
    users.forEach((userId) => {
      sendNotification(title, body, userId);
    })
  }


  const handleCancelEvent = async () => {
    setIsLoading(true);

    await cancelEvent(eventId)
      .then((result) => {
        setIsLoading(false);
        Swal.fire({
          title: '¡Éxito!',
          text: 'El evento se ha cancelado correctamente',
          icon: 'success',
          confirmButtonColor: 'green',
        }).then(async function () {
          navigate("/events");
          notifyUsers();
          cancelScheduledNotificationsForEvent(ref(notificationsContext.db), eventId);
        });
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoading(false);
        let errorText = "Ocurrió un error."
        errorText = errorText.concat(` ${error.response.data.detail}`);
        Swal.fire({
          title: '¡Error!',
          text: errorText,
          icon: 'error',
          confirmButtonColor: 'red',
        });
        console.log("publish error", error);
      });
  };

  /**
   * @description This function is called when the map is ready
   * @param {Object} map - reference to the map instance
   * @param {Object} maps - reference to the maps library
   */
  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    setMapReady(true);
  };

  useEffect(() => {
    async function fetchData() {
      getEvent(eventId).then((res) => setEvent(res.data));
    }
    fetchData();
  }, []);

  const prevImagePage = () => {
    if (imagePage !== 0) {
      setImagePage(imagePage - 1);
    }
  };

  const nextImagePage = () => {
    if (imagePage !== Math.ceil((event.images.length - 1) / 3)) {
      setImagePage(imagePage + 1);
    }
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f3f1fc" }}>
      <SideBar />
      {event && (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container direction="row"
                justifyContent="space-between"
                alignItems="center">
            <Grid item xs={8}>
              <Typography variant="h3" sx={{ marginRight: 2 }}>
                {event.name}
              </Typography>
            </Grid>
            {editableStates.includes(event.state) && (
              <Grid item xs={1}>
              <Button variant="text" onClick={() => navigate(`/events/${eventId}/edit`)}>
                <Stack direction="row" spacing={1}>
                  <Typography>Editar</Typography>
                  <EditIcon fontSize="small" />
                </Stack>
              </Button>
            </Grid>
            )}
          </Grid>
          <hr />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Paper
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                width: "60%"
              }}
            >
              <Box sx={{ display: "flex", paddingTop: 3, justifyContent: "center", alignItems: "center"}}>
                <Grid>
                  <Grid container justifyContent="flex-end">
                    <State state={event.state}></State>
                  </Grid>
                  <Grid>
                    {/*<div
                      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <Typography
                        variant="h3"
                        sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                      >
                        {event.name}
                      </Typography>
                      <State state={event.state}></State>
                    </div>*/}
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", marginTop: 2 }}
                    >
                      <strong>Fecha:</strong> {event.date}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", marginTop: 2 }}
                    >
                      <strong>Vacantes: </strong> {event.vacants}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", marginTop: 2 }}
                    >
                      <strong>Tipo: </strong> {event.type}
                    </Typography>
                  </Grid>
                  <Grid mt={5}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", marginTop: 2 }}
                    >
                      <strong>Descripción</strong>
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ display: "flex" }}
                    >
                      {parse(event.description)}
                    </Typography>
                  </Grid>
                  <Grid mt={5}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", marginTop: 2, justifyContent: "center", alignItems: "center" }}
                    >
                      <strong>Fotos</strong>
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                      }}
                    >
                      {event.images.length > 3 && imagePage > 0 && (
                        <Box>
                          <ChevronLeftIcon onClick={() => prevImagePage()} />
                        </Box>
                      )}
                      <ImageList cols={3} gap={20}>
                        {event.images
                          .slice(imagePage * 3, imagePage * 3 + 3)
                          .map((item, idx) => (
                            <ImageListItem key={idx}>
                              <img
                                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                                alt=""
                                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                loading="lazy"
                                style={{
                                  borderRadius: 10,
                                  width: 250,
                                  height: 250,
                                }}
                              />
                            </ImageListItem>
                          ))}
                      </ImageList>
                      {event.images.length > 3 &&
                        event.images.length > 3 * (imagePage + 1) && (
                          <Box>
                            <ChevronRightIcon onClick={() => nextImagePage()} />
                          </Box>
                        )}
                    </Box>
                  </Grid>
                  <Grid mt={5}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 1 }}
                    >
                      <strong>Ubicación</strong>
                    </Typography>
                    <Grid sx={{paddingLeft: 2}}>
                      <GoogleMap
                        apiKey={process.env.REACT_APP_GEO_APIKEY}
                        defaultCenter={{
                          lat: event.location.lat,
                          lng: event.location.lng,
                        }}
                        defaultZoom={15}
                        mapMinHeight="50vh"
                        onGoogleApiLoaded={onGoogleApiLoaded}
                      >
                        <Marker
                          key={1}
                          lat={event.location.lat}
                          lng={event.location.lng}
                          markerId={event.location.description}
                          className="marker"
                        />
                      </GoogleMap>
                    </Grid>
                  </Grid>
                  <Grid mt={5}>
                    <Typography
                      variant="h6"
                      sx={{display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <strong>Agenda</strong>
                    </Typography>
                    {event.agenda.map((horario, idx) => (
                      <Timeline
                        sx={{
                          [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.2,
                          },
                        }}
                      >
                        <TimelineItem>
                          <TimelineOppositeContent color="textSecondary">
                            {horario.time_init.substring(0, 5)} -{" "}
                            {horario.time_end.substring(0, 5)}
                          </TimelineOppositeContent>
                          <TimelineSeparator>
                            <TimelineDot />
                            {event.agenda.length - 1 !== idx && (
                              <TimelineConnector />
                            )}
                          </TimelineSeparator>
                          <TimelineContent>{horario.title}</TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    ))}
                  </Grid>
                  <Grid mt={5} mb={5}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <strong>FAQs</strong>
                    </Typography>
                    {event.FAQ.map((faq, idx) => (
                      <Accordion style={{ margin: 10 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          sx={{
                            backgroundColor: "#8978C7",
                            borderRadius: 1,
                          }}
                        >
                          <Typography color="white">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: "#e0e0e0" }}>
                          <Typography>{faq.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Grid>
                  <Grid mt={5} mb={5}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    >
                      <strong>Colaboradores</strong>
                    </Typography>
                    <EditableCollaborators eventData={event} setEventData={setEvent}/>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-around"
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 10, paddingBottom: 5 }}
                  >
                    {event.state === "Borrador" && !isLoading && (
                      <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={handlePublishEvent}
                      >
                        Publicar Evento
                      </Button>
                    )}
                    {(event.state === "Borrador" ||
                      event.state === "Publicado") &&
                      !isLoading && (
                        <Button
                          variant="contained"
                          size="large"
                          color="error"
                          onClick={handleCancelEvent}
                        >
                          Cancelar Evento
                        </Button>
                      )}
                    {isLoading && <CircularProgress color="primary" />}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
