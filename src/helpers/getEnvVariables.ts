export const getEnvVariables = () => {
  const env = import.meta.env;
  
  // Validar variables críticas
  const requiredVars = [
    'VITE_API_BASE_URL',
    'VITE_API_PRODUCTS_ENDPOINT',
    'VITE_API_PRODUCT_BY_ID_ENDPOINT'
  ];

  const missingVars = requiredVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Variables de entorno faltantes:', missingVars);
  }

  return {
    ...env,
    // Valores por defecto para desarrollo
    VITE_API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:3000',
    VITE_API_PRODUCTS_ENDPOINT: env.VITE_API_PRODUCTS_ENDPOINT || '/products',
    VITE_API_PRODUCT_BY_ID_ENDPOINT: env.VITE_API_PRODUCT_BY_ID_ENDPOINT || '/products/{id}',
    VITE_API_OWN_PRODUCTS_ENDPOINT: env.VITE_API_OWN_PRODUCTS_ENDPOINT || '/own-products',
    VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT: env.VITE_API_OWN_PRODUCT_BY_ID_ENDPOINT || '/own-products/{id}',
    VITE_API_DEFAULT_CONTENT_TYPE: env.VITE_API_DEFAULT_CONTENT_TYPE || 'application/json',
    VITE_API_DEFAULT_ACCEPT: env.VITE_API_DEFAULT_ACCEPT || 'application/json',
    MODE: env.MODE || 'development'
  };
};