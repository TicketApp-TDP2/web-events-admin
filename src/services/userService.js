import axios from "./axios";

export async function getUser(userId) {
  const response = await axios.get(
    `/users/${userId}`,
  );

  const user = {
    firstName: response.data.first_name,
    birthDate: response.data.birth_date,
    lastName: response.data.last_name,
    email: response.data.email,
    host: response.data.host,
    id: response.data.id,
    identificationNumber: response.data.identification_number,
    phoneNumber: response.data.phone_number,
  }

  return user;
}

export async function createUser({
  firstName,
  lastName,
  email,
  birthDate,
  idNumber,
  phoneNumber,
}) {
  const body = {
    email,
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    phone_number: phoneNumber,
    identification_number: idNumber,
    host: true, // ??
  }
  const response = await axios.post(`/users`, body,);

  return response.data;
}