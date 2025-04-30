import axios, { AxiosError } from "axios";
import { localStorage } from './localStorage'

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000 * 15, // 15 sec
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const data = localStorage.get();
    
    if (data?.token) {
      config.headers.Authorization = `Bearer ${data.token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(response);
    return {
      ...(response.data || {}),
      status: response.status,
    };
  },
  (error: AxiosError) => {
    if (error.response) {
      return {
        ...(error.response.data || {}),
        status: error.response.status,
      };
    }
    return {
      error: "Error",
    };
  }
);
export { api };