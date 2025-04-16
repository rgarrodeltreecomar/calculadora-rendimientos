import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Producto } from '../interfaces/interfaces';


type ResultadoComparativa = {
  producto: Producto;
  costoPorLitro: number;
  diferenciaPrecio: number;
  diferenciaRendimiento: number;
};

type Comparativa = {
  productoSeleccionado: Producto | undefined;
  resultados: ResultadoComparativa[];
};

export const useComparativa = (productos: Producto[], isLoading: boolean,  productoEstrellaProp?: Producto) => {
  const [productoEstrella, setProductoEstrella] = useState<Producto | undefined>(undefined);
  const [comparativa, setComparativa] = useState<Comparativa>({
    productoSeleccionado: undefined,
    resultados: []
  })

  useEffect(() => {
    // Usamos el producto estrella recibido o lo buscamos si no viene
    const estrella = productoEstrellaProp || productos.find(p => p.id === 1);
    setProductoEstrella(estrella || undefined);
    
    if (productos.length > 0 && !comparativa.productoSeleccionado) {
      setComparativa(prev => ({
        ...prev,
        productoSeleccionado: productos[0] // Seleccionamos el primero disponible
      }));
    }
  }, [productos, productoEstrellaProp, comparativa.productoSeleccionado]);



  const calcularComparativa = (productoAComparar?: Producto) => {
    const productoParaComparar = productoAComparar || comparativa.productoSeleccionado;
    
    if (!productoEstrella || !productoParaComparar) {
      Swal.fire('Error', 'Debes seleccionar un producto para comparar', 'error');
      return;
    }

    if (!productoEstrella.precio || !productoEstrella.presentacionEnLitros) {
      Swal.fire('Error', 'Faltan datos del producto estrella', 'error');
      return;
    }

    if (!productoParaComparar.precio || !productoParaComparar.presentacionEnLitros) {
      Swal.fire('Error', 'Faltan datos del producto a comparar', 'error');
      return;
    }

    const costoEstrellaPorLitro = productoEstrella.precio / productoEstrella.presentacionEnLitros;
    const costoCompararPorLitro = productoParaComparar.precio / productoParaComparar.presentacionEnLitros;

    const diferenciaPrecio = ((costoCompararPorLitro - costoEstrellaPorLitro) / costoEstrellaPorLitro) * 100;
    
    const diferenciaRendimiento = productoParaComparar.rendimientoPorLitro && productoEstrella.rendimientoPorLitro
      ? ((productoParaComparar.rendimientoPorLitro - productoEstrella.rendimientoPorLitro) / productoEstrella.rendimientoPorLitro) * 100
      : 0;

    const resultados = [
      {
        producto: productoEstrella,
        costoPorLitro: costoEstrellaPorLitro,
        diferenciaPrecio: 0,
        diferenciaRendimiento: 0
      },
      {
        producto: productoParaComparar,
        costoPorLitro: costoCompararPorLitro,
        diferenciaPrecio,
        diferenciaRendimiento
      }
    ];

    setComparativa({
      productoSeleccionado: productoParaComparar,
      resultados
    });
  };

  const seleccionarProducto = (producto: Producto) => {
    setComparativa(prev => ({
      ...prev,
      productoSeleccionado: producto
    }));
    calcularComparativa(producto);
  };

  return {
    isLoading,
    comparativa,
    productoEstrella,
    calcularComparativa,
    seleccionarProducto
  };
};