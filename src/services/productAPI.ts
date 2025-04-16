import axios from 'axios';
import { getEnvVariables } from '../helpers';

const {
  VITE_API_BASE_URL,
  VITE_API_PRODUCTS_ENDPOINT,
  VITE_API_PRODUCT_BY_ID_ENDPOINT,
  VITE_API_OWN_PRODUCTS_ENDPOINT,
  VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT,
  VITE_API_DEFAULT_CONTENT_TYPE,
  VITE_API_DEFAULT_ACCEPT
} = getEnvVariables();

export const endpoints = Object.freeze({

  products: `${VITE_API_BASE_URL}${VITE_API_PRODUCTS_ENDPOINT}`,
  productById: (id: number) => `${VITE_API_BASE_URL}${VITE_API_PRODUCT_BY_ID_ENDPOINT.replace('{id}', id.toString())}`,
  

  ownProducts: `${VITE_API_BASE_URL}${VITE_API_OWN_PRODUCTS_ENDPOINT}`,
  ownProductById: (id: number) => `${VITE_API_BASE_URL}${VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT.replace('{id}', id.toString())}`,
});

export const productAPI = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true ,
  headers: {
    "Content-Type": VITE_API_DEFAULT_CONTENT_TYPE,
    "Accept": VITE_API_DEFAULT_ACCEPT
  },
  
});

// Interceptor para manejar errores globalmente (opcional)
productAPI.interceptors.response.use(
  response => response,
  error => {
    // Puedes personalizar el manejo de errores aquí
    if (error.response) {
      console.error('Error de API:', error.response.data);
    } else {
      console.error('Error de red:', error.message);
    }
    return Promise.reject(error);
  }
);