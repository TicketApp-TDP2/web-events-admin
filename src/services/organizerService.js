import axios from "./axios";

export async function getOrganizer(userId) {
  const response = await axios.get(
    `/organizers/${userId}`,
  );

  const user = {
    firstName: response.data.first_name,
    lastName: response.data.last_name,
    email: response.data.email,
    id: response.data.id,
    profession: response.data.profession,
    aboutMe: response.data.about_me,
    profilePicture: response.data.profile_picture,
  }

  return user;
}

export async function createOrganizer({
  firstName,
  lastName,
  email,
  id
}) {
  const body = {
    email,
    first_name: firstName,
    last_name: lastName,
    id: id
  }
  const response = await axios.post(`/organizers`, body,);

  return response.data;
}