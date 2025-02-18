/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Base URL du backend

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",  // Changez cette URL selon votre backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupère le token depuis localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createNewEvent = async (data: FormData) => {
    try {
      const response = await api.post(`/evenements/create/`,data);
      return response.data; // Expected response: region statistics
    } catch (error) {
      console.error('Error fetching region statistics:', error);
      throw error;
    }
  };

let tokentmp = "";
const token_str = localStorage.getItem("token")
if (token_str){
  tokentmp = token_str
}
export const token = tokentmp;
