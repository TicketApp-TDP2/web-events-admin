import axios from "./axios";

export async function createEvent({
  name,
  description,
  location,
  organizer,
  type,
  images,
  preview_image,
  date,
  start_time,
  end_time,
  agenda,
  vacants,
  FAQ,
}) {
  const body = {
    name,
    description,
    location,
    organizer,
    type,
    images,
    preview_image,
    date,
    start_time,
    end_time,
    agenda,
    vacants,
    FAQ,
  };

  const response = await axios.post(`/events`, body);

  return response.data;
}

export async function getEvents(params) {
  console.log(params);
  return await axios.get("/events", { params });
}

export async function getEvent(id) {
  return await axios.get(`/events/${id}`);
}

export async function publishEvent(id) {
  return await axios.put(`/events/${id}/publish`);
}

export async function cancelEvent(id) {
  return await axios.put(`/events/${id}/cancel`);
}

export async function updateEvent(id, {
  name,
  description,
  location,
  organizer,
  type,
  images,
  preview_image,
  date,
  start_time,
  end_time,
  agenda,
  vacants,
  FAQ,
}) {
  const body = {
    name,
    description,
    location,
    organizer,
    type,
    images,
    preview_image,
    date,
    start_time,
    end_time,
    agenda,
    vacants,
    FAQ,
  };

  const response = await axios.put(`/events/${id}`, body);

  return response.data;
}

export async function getUsersEnrolled(eventId) {
  let users = [];
  const bookings = await axios.get(`bookings/event/${eventId}`);
  for (const booking of bookings.data) {
    users.push(booking.reserver_id);
  }

  return users;
}

export async function addCollaborator({id, collaborator_email}) {
  const response = await axios.put(`events/${id}/add_collaborator/${collaborator_email}`);
  return response.data
}

export async function removeCollaborator({id, collaborator_email}) {
  const response = await axios.put(`events/${id}/remove_collaborator/${collaborator_email}`);
  return response.data
}