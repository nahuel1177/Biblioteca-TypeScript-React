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
      console.log('Token enviado:', `Bearer ${data.token.substring(0, 10)}...`);
    } else {
      console.warn('No se encontró token de autenticación');
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Error en la solicitud:', error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(response);
    return {
      ...(response.data || {}),
      status: response.status,
      success: true
    };
  },
  (error: AxiosError) => {
    if (error.response) {
      // Manejo específico para errores de autenticación
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Error de autenticación:', error.response.data);
        return {
          ...(error.response.data || {}),
          status: error.response.status,
          message: (error.response.data as { message?: string })?.message || 'Error de autenticación',
          success: false
        };
      }
      
      // Manejo específico para error de stock externo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (error.response.data && (error.response.data as any).error === 'Imposible actualizar stock externo.') {
        console.error('Error de stock:', error.response.data);
        return {
          ...(error.response.data || {}),
          status: error.response.status,
          message: 'No se pudo actualizar el stock del libro. Por favor, contacte al administrador.',
          success: false
        };
      }
      
      console.error('Error de respuesta:', error.response.data);
      return {
        ...(error.response.data || {}),
        status: error.response.status,
        success: false
      };
    }
    console.error('Error de conexión:', error.message);
    return {
      error: "Error de conexión con el servidor",
      message: error.message,
      success: false
    };
  }
);
export { api };