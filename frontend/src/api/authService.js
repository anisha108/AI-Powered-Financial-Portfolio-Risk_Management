import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

// Function to handle user registration
export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed.');
  }
};

// Function to handle user login
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    // Save the token on successful login
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed.');
  }
};