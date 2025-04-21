import { useEffect, useState } from 'react';
import { Calculadora } from './Calculadora';
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

  const handleSaveProduct = async (updatedProduct: Partial<Producto>) => {
    if (!productoAEditar?.id) return;
    
    try {
      if (updatedProduct.precio !== undefined && updatedProduct.presentacionEnLitros !== undefined) {
        await updateProducto(productoAEditar.id, {
          precio: updatedProduct.precio,
          presentacionEnLitros: updatedProduct.presentacionEnLitros
        });
        await getProductos();
        setProductoAEditar(null);
      } else {
        throw new Error('Faltan campos para actualizar el producto');
      }
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