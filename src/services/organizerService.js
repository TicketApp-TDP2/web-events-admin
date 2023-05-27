import axios from "./axios";

export async function getOrganizer(userId) {
  const response = await axios.get(
    `/organizers/${userId}`,
  );

  const user = {
    first_name: response.data.first_name,
    last_name: response.data.last_name,
    email: response.data.email,
    id: response.data.id,
    profession: response.data.profession,
    about_me: response.data.about_me,
    profile_picture: response.data.profile_picture,
    suspended: response.data.suspended,
  }

  return user;
}

export async function createOrganizer({
  first_name,
  last_name,
  email,
  id
}) {
  const body = {
    email,
    first_name: first_name,
    last_name: last_name,
    id: id
  }
  const response = await axios.post(`/organizers`, body,);

  return response.data;
}

export async function updateOrganizer({
  first_name,
  last_name,
  profession, 
  about_me,
  profile_picture,
  id,
}) {
  const body = {
  first_name,
  last_name,
  profession, 
  about_me,
  profile_picture,
  }
  const response = await axios.put(`/organizers/${id}`, body,);

  return response.data;
}