import { useCallback, useState } from 'react';
import { productAPI, endpoints } from '../services/productAPI';
import Swal from 'sweetalert2';
import { Producto } from '../interfaces/interfaces';
import { processProductsImages } from '../helpers/productImageHelper';

// Datos locales para cuando la API no esté disponible
const productosLocales: Producto[] = [
  {
    id: 1,
    nombre: 'TRIDEX',
    descripcion: 'Detergente Enzimático',
    foto: '/tridex.jpg',
    presentacionEnLitros: 5,
    precio: 0,
    rendimientoPorLitro: 0
  },
  {
    id: 2,
    nombre: 'NOVAZIME',
    descripcion: 'Detergente Enzimático',
    foto: '/NOVAZIME.jpg',
    presentacionEnLitros: 5,
    precio: 0,
    rendimientoPorLitro: 0
  }
];

export const useProducts = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProductos = useCallback(async () => {
    console.log('🚀 Iniciando getProductos...');
    console.log('📡 URL de la API:', endpoints.products);
    setIsLoading(true);
    
    try {
      console.log('📤 Enviando petición GET a la API...');
      const response = await productAPI.get(endpoints.products);
      console.log('📥 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        dataLength: response.data?.length
      });
      
      if (response.data && response.data.length) {
        console.log('✅ Datos recibidos correctamente');
        console.log('📦 Datos crudos:', response.data);
        
        const productosProcesados = processProductsImages(response.data);
        console.log('🖼️ Productos procesados:', productosProcesados);
        
        setProductos(productosProcesados);
        console.log('💾 Estado actualizado con productos procesados');
        
        // Log detallado de cada producto
        productosProcesados.forEach((producto, index) => {
          console.log(`📋 Producto ${index + 1}:`, {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            foto: producto.foto,
            presentacionEnLitros: producto.presentacionEnLitros,
            dilucionDeUsoMaxima: producto.dilucionDeUsoMaxima
          });
        });
      } else {
        console.warn('⚠️ No se recibieron datos o el array está vacío');
        Swal.fire({
          icon: 'info',
          title: 'Usando datos locales',
          text: 'No se pudieron obtener los productos del servidor',
          timer: 3000
        });
        // Usar datos locales cuando no hay respuesta de la API
        const productosProcesados = processProductsImages(productosLocales);
        setProductos(productosProcesados);
      }
    } catch (error) {
      console.error('❌ Error en getProductos:', error);
      
      // Log detallado del error
      if (error instanceof Error) {
        console.error('Detalles del error:', {
          name: error.name,
          message: error.message
        });
      }
      
      Swal.fire({
        icon: 'warning',
        title: 'Error de conexión',
        text: 'No se pudo conectar al servidor',
        timer: 3000
      });
      // Usar datos locales cuando hay error de conexión
      const productosProcesados = processProductsImages(productosLocales);
      setProductos(productosProcesados);
    } finally {
      setIsLoading(false);
      console.log('🏁 Finalizado getProductos');
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

  const updateProducto = async (id: number, updatedData: Partial<Producto>) => {
    setIsLoading(true);
    try {
      const response = await productAPI.patch(endpoints.productById(id), updatedData);
      
      if (response.status === 200) {
        // Actualizar el estado local con el producto actualizado
        setProductos(prev => prev.map(p => 
          p.id === id ? { ...p, ...updatedData } : p
        ));
        return response.data;
      }
      throw new Error('Error al actualizar el producto');
    } catch (error) {
      console.error('Error en updateProducto:', error);
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
    deleteProducto,
    updateProducto
  };
};