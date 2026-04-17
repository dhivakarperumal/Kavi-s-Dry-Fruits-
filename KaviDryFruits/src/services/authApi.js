import api from "./api";

const handleResponse = (response) => {
  if (!response?.data) {
    throw new Error("Empty API response.");
  }
  return response.data;
};

export const registerUser = async ({ firstName, email, phone, password }) => {
  const response = await api.post('/auth/register', {
    firstName,
    email,
    phone,
    password,
  });
  return handleResponse(response);
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  return handleResponse(response);
};
