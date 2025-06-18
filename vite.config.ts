import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isDevelopment = mode === 'development';
  
  return {
    plugins: [react()],
    server: isDevelopment ? {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Origin', env.VITE_DEV_ORIGIN || 'http://localhost:5173');
            });
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = env.VITE_DEV_ORIGIN || '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
            });
          }
        }
      }
    } : undefined,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // Configuración específica para producción
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
          }
        }
      }
    },
    // Configuración base para la aplicación
    base: '/',
    // Optimizaciones para producción
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material']
    }
  };
});