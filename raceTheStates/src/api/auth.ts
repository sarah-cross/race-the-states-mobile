import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your backend URL if hosted elsewhere
//const API_URL = 'http://10.0.0.81:8000/api';

export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    return response.data; // Return user data or success message
  } catch (error: any) {
    throw error.response?.data || 'Registration failed. Please try again.';
  }
};

export const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/token/`, {
        username: email,
        password,
      });
      console.log('Login Response:', response.data); // Debugging: Log the entire response
      return response.data;
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error);
      throw error.response?.data || 'Login failed. Please try again.';
    }
  };

  export const resetPassword = async (token: any, password: string) => {
    const response = await axios.post(`${API_URL}/password-reset-confirm/`
, {
      token,
      password,
    });
    return response.data;
  };
  
  
