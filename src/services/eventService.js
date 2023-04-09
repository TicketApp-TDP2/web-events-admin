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
    }
  
    const response = await axios.post(
      `/events`,
      body,
    );
  
    return response.data;
  }

  export async function getEvents(params) {
    console.log(params)
    return await axios.get('/events', { params });
  }

  export async function getEvent(id) {
    return await axios.get(`/events/${id}`);
  }