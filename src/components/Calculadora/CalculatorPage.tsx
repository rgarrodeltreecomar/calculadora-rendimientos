import { useEffect, useState } from 'react';
import { Calculadora } from './Calculadora';
import { EditProductModal } from '../Modal/Modal';
import { useProducts } from '../../hooks';
import { Producto } from '../../interfaces/interfaces';
import { useProductPrices } from '../../hooks/useProductPrices';
import Swal from 'sweetalert2';

export const CalculatorPage = () => {
  const { productos, getProductos, isLoading } = useProducts();
  const { getProductPrice, updateProductPrice, productPrices } = useProductPrices();
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [productoEstrella, setProductoEstrella] = useState<Producto | undefined>();
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-render

  useEffect(() => {
    getProductos();
  }, [getProductos]);

  useEffect(() => {
    if (productos.length > 0) {
      const estrella = productos.find(p => p.id === 1);
      setProductoEstrella(estrella);
    }
  }, [productos]);

  useEffect(() => {
    console.log('🔄 CalculatorPage - productoSeleccionado cambió:', {
      productoSeleccionado: productoSeleccionado?.nombre,
      id: productoSeleccionado?.id
    });
  }, [productoSeleccionado]);

  const handleEditProduct = (producto: Producto) => {
    console.log('🔄 Editando producto:', producto.nombre);
    setProductoAEditar(producto);
  };

  const handleSaveProduct = async (updatedProduct: Partial<Producto>) => {
    if (!productoAEditar?.id) return;
    
    try {
      // Si es el producto estrella, no permitir edición
      if (productoAEditar.id === 1) {
        Swal.fire("Error", "El producto estrella no se puede modificar", "error");
        return;
      }

      if (updatedProduct.precio !== undefined && updatedProduct.presentacionEnLitros !== undefined) {
        // Usar sessionStorage en lugar del backend
        updateProductPrice(
          productoAEditar, 
          updatedProduct.precio, 
          updatedProduct.presentacionEnLitros
        );
        
        // Cerrar el modal
        setProductoAEditar(null);
        
        // Mostrar mensaje de éxito
        await Swal.fire("Éxito", "Precio actualizado correctamente", "success");
        
        // Forzar actualización de la tabla
        console.log('🔄 Forzando actualización de la tabla');
        setRefreshKey(prev => prev + 1);
        
        // Seleccionar automáticamente el producto que se acaba de editar
        console.log('🎯 Seleccionando automáticamente el producto editado:', productoAEditar.nombre);
        setProductoSeleccionado(productoAEditar);
        
      } else {
        throw new Error('Faltan campos para actualizar el producto');
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  const handleSelectProduct = async (producto: Producto) => {
    console.log('🎯 CalculatorPage - handleSelectProduct iniciado:', producto.nombre);
    
    // Si es el producto estrella, no permitir selección
    if (producto.id === 1) {
      console.log('⚠️ CalculatorPage - Producto estrella seleccionado, mostrando SweetAlert');
      await Swal.fire({
        icon: 'warning',
        title: 'No se puede seleccionar',
        text: 'El producto estrella no puede ser seleccionado para comparar',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Verificar si el producto ya tiene precio
    const precioProducto = getProductPrice(producto);
    const tienePrecioValido = Boolean(precioProducto && precioProducto.precio > 0);

    console.log('💰 CalculatorPage - Verificación de precio:', {
      producto: producto.nombre,
      precioProducto,
      tienePrecioValido
    });

    if (!tienePrecioValido) {
      console.log('⚠️ CalculatorPage - Producto sin precio, mostrando SweetAlert y abriendo modal');
      // Mostrar mensaje informativo
      await Swal.fire({
        icon: 'info',
        title: 'Información importante',
        text: 'Para comparar este producto, primero debe ingresar su precio y presentación en litros.',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

      // Abrir el modal para editar el producto
      console.log('Abriendo modal para producto:', producto.nombre);
      setProductoAEditar(producto);
      return; // No establecer como seleccionado hasta que tenga precio
    }

    // Si tiene precio válido, establecer como seleccionado
    console.log('✅ CalculatorPage - Producto con precio válido, estableciendo como seleccionado');
    setProductoSeleccionado(producto);
  };

  return (
    <>
      <Calculadora
        key={refreshKey}
        productosDisponibles={productos.filter(p => p.id !== 1)} // Filtrar producto estrella
        productoEstrella={productoEstrella}
        onEditProduct={handleEditProduct}
        onSelectProduct={handleSelectProduct}
        isLoading={isLoading}
        getProductPrice={getProductPrice}
        productPrices={productPrices}
        productoSeleccionado={productoSeleccionado}
      />
      {productoAEditar && (
        <EditProductModal
          onClose={() => setProductoAEditar(null)}
          producto={productoAEditar}
          onSave={handleSaveProduct}
          getProductPrice={getProductPrice}
        />
      )}
    </>
  );
};