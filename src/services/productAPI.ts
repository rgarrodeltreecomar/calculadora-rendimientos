import axios from 'axios';
import { getEnvVariables } from '../helpers';

const {
  VITE_API_BASE_URL,
  VITE_API_PRODUCTS_ENDPOINT,
  VITE_API_PRODUCT_BY_ID_ENDPOINT,
  VITE_API_OWN_PRODUCTS_ENDPOINT,
  VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT,
  VITE_API_DEFAULT_CONTENT_TYPE,
  VITE_API_DEFAULT_ACCEPT,
  MODE
} = getEnvVariables();

// En desarrollo, usamos el proxy de Vite
const baseURL = MODE === 'development' ? '/api' : VITE_API_BASE_URL;

export const endpoints = Object.freeze({
  products: `${VITE_API_PRODUCTS_ENDPOINT}`,
  productById: (id: number) => `${VITE_API_PRODUCT_BY_ID_ENDPOINT.replace('{id}', id.toString())}`,
  ownProducts: `${VITE_API_OWN_PRODUCTS_ENDPOINT}`,
  ownProductById: (id: number) => `${VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT.replace('{id}', id.toString())}`,
});

export const productAPI = axios.create({
  baseURL,
  withCredentials: MODE === 'development', // Solo usamos withCredentials en desarrollo
  headers: {
    "Content-Type": VITE_API_DEFAULT_CONTENT_TYPE,
    "Accept": VITE_API_DEFAULT_ACCEPT
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores globalmente
productAPI.interceptors.response.use(
  response => response,
  error => {
    console.error('🚨 Error de API detectado:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    });

    if (error.response) {
      // Error de respuesta del servidor
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('❌ Error de autenticación:', data);
          break;
        case 403:
          console.error('❌ Error de autorización:', data);
          break;
        case 404:
          console.error('❌ Recurso no encontrado:', data);
          break;
        case 500:
          console.error('❌ Error interno del servidor:', data);
          break;
        default:
          console.error('❌ Error de API:', data);
      }
    } else if (error.request) {
      // Error de red (sin respuesta del servidor)
      console.error('🌐 Error de red:', error.message);
    } else {
      // Error en la configuración de la petición
      console.error('⚙️ Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Interceptor para requests (logging)
productAPI.interceptors.request.use(
  config => {
    console.log('📤 Request enviado:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);