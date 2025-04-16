import { useCallback, useState } from 'react';
import { productAPI, endpoints } from '../services/productAPI';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Producto } from '../interfaces/interfaces';
// import { productosMercado } from '../utils/objetos';

export const useProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getProductos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await productAPI.get(endpoints.products);
      if (response.data && response.data.length) {
        const productosConHttps = response.data.map((producto: { foto: string; }) => ({
          ...producto,
          foto: producto.foto?.replace('http://', 'https://')
        }));
        setProductos(productosConHttps);
        console.log("Info de get: ", response.data )
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Usando datos locales',
          text: 'No se pudieron obtener los productos del servidor',
          timer: 3000
        });
      }
    }  catch (error) {
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

  const updateProducto = async (id: number, productoData: Producto) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      Object.entries(productoData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
  
      const response = await productAPI.put(endpoints.productById(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status === 201 || response.status === 204) {
        Swal.fire("Éxito", "Producto actualizado correctamente.", "success");
        setProductos(prev => prev.map(p => p.id === id ? {...productoData, id} : p));
        return response.data;
      }
    } catch (error) {
      console.error("Error en updateProducto:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor. Verifica tu conexión de red.',
        timer: 3000
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