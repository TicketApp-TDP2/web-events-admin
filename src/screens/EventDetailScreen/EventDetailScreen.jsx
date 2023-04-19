import SideBar from "../../components/SideBar";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  ImageListItem,
  Paper,
  Typography,
  ImageList,
  Button,
  CircularProgress,
  Modal,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { getEvent } from "../../services/eventService";
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

dayjs.extend(customParseFormat);

export function EventDetailScreen() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [imagePage, setImagePage] = useState(0);

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [openError, setOpenError] = useState(false);
  const [successName, setSuccessName] = useState("");

  useEffect(() => {
    console.log("useEffect");
    if (errorMsg) {
      console.log("hay error");
      setOpenError(true);
    }
  }, [errorMsg]);

  const handlePublishEvent = async () => {
    setIsLoading(true);

    await publishEvent(eventId)
      .then((result) => {
        setIsLoading(false);
        setOpenSuccess(true);
        setSuccessName("publicado");
        navigate("/events");
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMsg(`${error.response.data.detail}`);
        console.log("publish error", error);
      });
  };

  const handleCancelEvent = async () => {
    setIsLoading(true);

    await cancelEvent(eventId)
      .then((result) => {
        setIsLoading(false);
        setOpenSuccess(true);
        setSuccessName("cancelado");
        navigate("/events");
        console.log("response", result);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMsg(`${error.response.data.detail}`);
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
          <Grid item style={{ flexGrow: "1" }}>
            <Typography variant="h3" sx={{ marginRight: 2 }}>
              {event.name}
            </Typography>
            <hr />
          </Grid>
          <Paper
            style={{
              backgroundColor: "white",
              borderRadius: 20,
            }}
          >
            <Box sx={{ display: "flex" }}>
              <Grid>
                <Grid>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                    >
                      <strong>Fecha:</strong> {event.date}
                    </Typography>
                    <State state={event.state}></State>
                  </div>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                  >
                    <strong>Vacantes:</strong> {event.vacants}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2, marginTop: 2 }}
                  >
                    <strong>Tipo:</strong> {event.type}
                  </Typography>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Descripción</strong>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    {parse(event.description)}
                  </Typography>
                </Grid>
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
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
                    sx={{ marginRight: 2, marginLeft: 2 }}
                  >
                    <strong>Ubicación</strong>
                  </Typography>
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
                <Grid mt={5}>
                  <Typography
                    variant="h6"
                    sx={{ marginRight: 2, marginLeft: 2 }}
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
                    sx={{ marginRight: 2, marginLeft: 2 }}
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
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="space-around"
                  sx={{ paddingTop: 10, paddingBottom: 2 }}
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
                        color="primary"
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
      )}
      <Modal
        open={openError}
        onClose={() => {
          setOpenError(false);
          setErrorMsg("");
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "#ff5252",
        }}
      >
        <Box sx={modalStyle}>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorOutlineIcon sx={{ color: "#ff5252", marginRight: 1 }} />
            <Typography variant="h5">¡Ocurrió un error!</Typography>
          </Grid>
          <Typography variant="body1">{errorMsg}</Typography>
        </Box>
      </Modal>
      <Modal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={modalStyle}>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckCircleOutlineIcon sx={{ color: "#4caf50", marginRight: 1 }} />
            <Typography variant="h5">¡Éxito!</Typography>
          </Grid>
          <Typography variant="body1">
            El evento se ha {successName} correctamente
          </Typography>
        </Box>
      </Modal>
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
