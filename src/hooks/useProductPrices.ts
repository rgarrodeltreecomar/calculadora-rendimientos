import { useState, useEffect, useCallback } from 'react';
import { Producto } from '../interfaces/interfaces';

const STORAGE_KEY = 'product_prices';

export interface ProductPrice {
  id: number;
  precio: number;
  presentacionEnLitros: number;
}

export const useProductPrices = () => {
  const [productPrices, setProductPrices] = useState<Record<number, ProductPrice>>({});

  // Cargar precios del sessionStorage al iniciar
  useEffect(() => {
    const storedPrices = sessionStorage.getItem(STORAGE_KEY);
    if (storedPrices) {
      try {
        const parsedPrices = JSON.parse(storedPrices);
        console.log('📥 useProductPrices - Precios cargados del sessionStorage:', parsedPrices);
        setProductPrices(parsedPrices);
      } catch (error) {
        console.error('❌ useProductPrices - Error al cargar precios:', error);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Guardar precios en sessionStorage cuando cambien
  useEffect(() => {
    console.log('💾 useProductPrices - Guardando precios en sessionStorage:', productPrices);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(productPrices));
  }, [productPrices]);

  // Log cuando cambia el estado de productPrices
  useEffect(() => {
    console.log('🔄 useProductPrices - Estado de productPrices cambió:', productPrices);
  }, [productPrices]);

  const updateProductPrice = useCallback((producto: Producto, precio: number | string, presentacionEnLitros: number | string) => {
    console.log('📝 useProductPrices - updateProductPrice iniciado:', {
      producto: producto.nombre,
      precio,
      presentacionEnLitros
    });

    // No permitir actualizar el precio del producto estrella
    if (producto.id === 1) {
      console.warn('⚠️ useProductPrices - No se puede actualizar el precio del producto estrella');
      return;
    }

    // Convertir a números y validar
    const precioNum = Number(precio);
    const presentacionNum = Number(presentacionEnLitros);

    // Validar que el precio sea mayor que 0
    if (isNaN(precioNum) || precioNum <= 0) {
      console.warn('⚠️ useProductPrices - El precio debe ser un número mayor que 0');
      return;
    }

    // Validar que la presentación sea mayor que 0
    if (isNaN(presentacionNum) || presentacionNum <= 0) {
      console.warn('⚠️ useProductPrices - La presentación debe ser un número mayor que 0');
      return;
    }

    setProductPrices(prev => {
      const newPrices = {
        ...prev,
        [producto.id!]: {
          id: producto.id!,
          precio: precioNum,
          presentacionEnLitros: presentacionNum
        }
      };
      console.log('✅ useProductPrices - Precios actualizados:', newPrices);
      return newPrices;
    });
  }, []);

  const getProductPrice = useCallback((producto: Producto): ProductPrice | undefined => {
    console.log('🔍 useProductPrices - getProductPrice para:', producto.nombre);
    console.log('📊 useProductPrices - Estado actual de productPrices:', productPrices);
    
    // Si es el producto estrella, usar el precio de la base de datos
    if (producto.id === 1) {
      const precio = {
        id: producto.id,
        precio: Number(producto.precio),
        presentacionEnLitros: Number(producto.presentacionEnLitros)
      };
      console.log('⭐ useProductPrices - Precio del producto estrella:', precio);
      return precio;
    }

    // Para otros productos, primero verificar si hay un precio editado en sessionStorage
    const precioEditado = productPrices[producto.id!];
    console.log('🔍 useProductPrices - Buscando precio editado para ID', producto.id, ':', precioEditado);
    
    if (precioEditado) {
      const precio = {
        ...precioEditado,
        precio: Number(precioEditado.precio),
        presentacionEnLitros: Number(precioEditado.presentacionEnLitros)
      };
      console.log('📝 useProductPrices - Precio editado encontrado:', precio);
      return precio;
    }

    // Si no hay precio editado, usar el precio de la base de datos
    if (producto.precio !== undefined && producto.presentacionEnLitros !== undefined) {
      const precio = {
        id: producto.id!,
        precio: Number(producto.precio),
        presentacionEnLitros: Number(producto.presentacionEnLitros)
      };
      console.log('💾 useProductPrices - Precio de la base de datos:', precio);
      return precio;
    }

    console.log('⚠️ useProductPrices - No se encontró precio para:', producto.nombre);
    return undefined;
  }, [productPrices]);

  const hasProductPrice = useCallback((producto: Producto): boolean => {
    console.log('💰 useProductPrices - hasProductPrice para:', producto.nombre);
    
    // El producto estrella siempre tiene precio
    if (producto.id === 1) {
      console.log('⭐ useProductPrices - Producto estrella siempre tiene precio');
      return true;
    }

    // Verificar si hay un precio editado en sessionStorage
    const precioEditado = productPrices[producto.id!];
    if (precioEditado && precioEditado.precio > 0) {
      console.log('📝 useProductPrices - Producto tiene precio editado válido');
      return true;
    }

    // Verificar si hay un precio en la base de datos mayor que 0
    const tienePrecioValido = producto.precio !== undefined && 
                             producto.presentacionEnLitros !== undefined && 
                             producto.precio > 0;
    
    console.log('💾 useProductPrices - Producto tiene precio en BD:', tienePrecioValido);
    return tienePrecioValido;
  }, [productPrices]);

  const clearProductPrices = useCallback(() => {
    console.log('🧹 useProductPrices - Limpiando precios');
    setProductPrices({});
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const reloadProductPrices = useCallback(() => {
    console.log('🔄 useProductPrices - Recargando precios del sessionStorage');
    const storedPrices = sessionStorage.getItem(STORAGE_KEY);
    if (storedPrices) {
      try {
        const parsedPrices = JSON.parse(storedPrices);
        console.log('📥 useProductPrices - Precios recargados:', parsedPrices);
        setProductPrices(parsedPrices);
      } catch (error) {
        console.error('❌ useProductPrices - Error al recargar precios:', error);
      }
    }
  }, []);

  return {
    updateProductPrice,
    getProductPrice,
    hasProductPrice,
    clearProductPrices,
    reloadProductPrices,
    productPrices
  };
}; 