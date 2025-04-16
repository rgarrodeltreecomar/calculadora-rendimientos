import { useEffect, useState } from 'react';
import { Calculadora } from './Calculadora.tsx';
import { EditProductModal } from '../Modal/Modal';
import { useProducts } from '../../hooks';
import { Producto } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';


export const CalculatorPage = () => {
  const { productos, updateProducto, isLoading, getProductos } = useProducts();
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  useEffect(() => {
    getProductos();
  }, [getProductos]);



  const productosDisponibles = productos.filter(p => p.id !== 1);
  const productoEstrella = productos.find(p => p.id === 1);

  const handleEditClick = (producto: Producto) => {
    setProductoAEditar(producto);
  };

  const handleSaveProduct = async (updatedProduct: Producto) => {
    if (!productoAEditar?.id) return;
    
    try {
      // Llama a updateProducto con el ID y los nuevos datos
      await updateProducto(productoAEditar.id, updatedProduct);
      
      // Actualiza la lista de productos después de editar
      await getProductos();
      
      setProductoAEditar(null);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
  };

  return (
    <>
      <Calculadora 
       isLoading={isLoading}
        productosDisponibles={productosDisponibles}
        onEditProduct={handleEditClick} 
        productoEstrella={productoEstrella}
      />
      
      {productoAEditar && (
        <EditProductModal
          producto={productoAEditar}
          onSave={handleSaveProduct}
          onClose={() => setProductoAEditar(null)}
        />
      )}
    </>
  );
};