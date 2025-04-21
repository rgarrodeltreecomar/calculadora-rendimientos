
import { useCallback, useState } from 'react';
import { productAPI, endpoints } from '../services/productAPI';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Producto } from '../interfaces/interfaces';
import { processProductsImages } from '../helpers/productImageHelper';


export const useProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getProductos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productAPI.get(endpoints.products);
      
      if (response.data && response.data.length) {
        const productosProcesados = processProductsImages(response.data);
        
        setProductos(productosProcesados);
        console.log("Productos obtenidos: ", productosProcesados);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Usando datos locales',
          text: 'No se pudieron obtener los productos del servidor',
          timer: 3000
        });
      }
    } catch (error) {
      console.error('Error en getProductos:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor',
        timer: 3000
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const getProductoById = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await productAPI.get(endpoints.productById(id));
      return response.data;
    } catch (error) {
      console.error(`Error en getProductoById:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createProducto = async (productoData: Producto) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      Object.entries(productoData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await productAPI.post(endpoints.products, formData);

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Éxito", "Producto creado correctamente.", "success");
        navigate('/productos');
        return response.data;
      }
    } catch (error) {
      console.error("Error en createProducto:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const updateProducto = async (id: number, productoData: Partial<Producto>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // 1. Campos obligatorios según la configuración
      formData.append('Id', id.toString());
      formData.append('Nombre', productoData.nombre || '');
      formData.append('Descripcion', productoData.descripcion || '');
      formData.append('PresentacionEnLitros', (productoData.presentacionEnLitros ?? 0).toString());
      formData.append('DilucionDeUsoMaxima', (productoData.dilucionDeUsoMaxima ?? 0).toString());
      formData.append('Precio', (productoData.precio ?? 0).toString());
      

  
      // 3. Envío con configuración específica
      const response = await productAPI.put(
        endpoints.productById(id),
        formData
      );
  
      if (response.status >= 200 && response.status < 300) {
        Swal.fire('Éxito', 'Producto actualizado', 'success');
        setProductos(prev => 
          prev.map(p => p.id === id ? { ...p, ...response.data } : p)
        );
        return response.data;
      }
      throw new Error(`Error HTTP: ${response.status}`);
    } catch (error) {
      let errorMessage = 'Error al actualizar el producto';
      
      // Manejo mejorado de errores
      if (typeof error === 'object' && error !== null) {
        const apiError = error as {
          response?: {
            data?: { 
              message?: string;
              errors?: Record<string, string[]>;
            };
            status?: number;
          };
          message?: string;
        };
        
        errorMessage = apiError.response?.data?.message || 
                      (apiError.response?.data?.errors && Object.values(apiError.response.data.errors).join('\n')) || 
                      apiError.message || 
                      errorMessage;
      }
  
      console.error('Detalle del error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        timer: 5000,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const deleteProducto = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await productAPI.delete(endpoints.productById(id));

      if (response.status === 200 || response.status === 204) {
        Swal.fire("Éxito", "Producto eliminado correctamente.", "success");
        setProductos(prev => prev.filter(producto => producto.id !== id));
      }
    } catch (error) {
      console.error("Error en deleteProducto:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  return {
    productos,
    isLoading,
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,

  };
};