import { useState, useCallback, useEffect } from 'react';
import { Producto } from '../interfaces/interfaces';
import { useProductPrices, ProductPrice } from './useProductPrices';

export interface ResultadoComparativa {
  producto: Producto;
  costoPorLitro: number;
  diferenciaPrecio: number;
  diferenciaRendimiento: number;
  necesitaPrecio: boolean;
}

export const useComparativa = (
  isLoading: boolean,
  productoEstrella: Producto | null,
  productoSeleccionado: Producto | null,
  getProductPrice: (producto: Producto) => ProductPrice | undefined,
  productPrices: Record<number, ProductPrice>
) => {
  const { reloadProductPrices } = useProductPrices();
  const [comparativa, setComparativa] = useState<ResultadoComparativa[]>([]);
  const [mostrarComparativa, setMostrarComparativa] = useState(false);
  const [isCalculando, setIsCalculando] = useState(false);

  const calcularComparativa = useCallback(async () => {
    console.log('🔄 useComparativa - calcularComparativa iniciado:', {
      productoEstrella: productoEstrella?.nombre,
      productoSeleccionado: productoSeleccionado?.nombre,
      isLoading
    });

    if (!productoEstrella || !productoSeleccionado || isLoading) {
      console.log('❌ useComparativa - Condiciones no cumplidas, limpiando estado');
      setComparativa([]);
      setMostrarComparativa(false);
      return;
    }

    setIsCalculando(true);
    console.log('⚡ useComparativa - Iniciando cálculo...');

    try {
      // Recargar precios del sessionStorage antes de calcular
      reloadProductPrices();
      
      // Obtener precios usando getProductPrice que maneja sessionStorage
      const precioEstrella = getProductPrice(productoEstrella);
      const precioComparar = getProductPrice(productoSeleccionado);

      console.log('💰 useComparativa - Precios obtenidos:', {
        estrella: precioEstrella,
        comparar: precioComparar
      });

      if (!precioEstrella || !precioComparar) {
        throw new Error('No se pudieron obtener los precios');
      }

      // Verificar que ambos productos tengan precio válido
      if (precioEstrella.precio <= 0 || precioComparar.precio <= 0) {
        throw new Error('Uno o ambos productos no tienen precio válido');
      }

      // Calcular costos por litro usando los precios del sessionStorage
      // El precio por litro se calcula con la presentación modificada por el usuario
      const costoPorLitroEstrella = precioEstrella.precio / precioEstrella.presentacionEnLitros;
      const costoPorLitroComparar = precioComparar.precio / precioComparar.presentacionEnLitros;

      console.log('🧮 useComparativa - Costos por litro calculados:', {
        estrella: costoPorLitroEstrella,
        comparar: costoPorLitroComparar
      });

      // Calcular rendimiento por litro usando la fórmula: RendimientoPorLitro = PresentacionEnLitros * 1000 / DilucionDeUsoMaxima
      // Usar la presentacionEnLitros original del producto, no la modificada por el usuario
      // Esto asegura que el rendimiento sea consistente independientemente de cómo el usuario modifique la presentación
      const rendimientoPorLitroEstrella = productoEstrella.dilucionDeUsoMaxima 
        ? (productoEstrella.presentacionEnLitros * 1000) / productoEstrella.dilucionDeUsoMaxima 
        : 0;
      const rendimientoPorLitroComparar = productoSeleccionado.dilucionDeUsoMaxima 
        ? (productoSeleccionado.presentacionEnLitros * 1000) / productoSeleccionado.dilucionDeUsoMaxima 
        : 0;

      console.log('📊 useComparativa - Rendimientos por litro calculados:', {
        estrella: {
          presentacionEnLitrosOriginal: productoEstrella.presentacionEnLitros,
          presentacionEnLitrosUsuario: precioEstrella.presentacionEnLitros,
          dilucionDeUsoMaxima: productoEstrella.dilucionDeUsoMaxima,
          rendimientoPorLitro: rendimientoPorLitroEstrella
        },
        comparar: {
          presentacionEnLitrosOriginal: productoSeleccionado.presentacionEnLitros,
          presentacionEnLitrosUsuario: precioComparar.presentacionEnLitros,
          dilucionDeUsoMaxima: productoSeleccionado.dilucionDeUsoMaxima,
          rendimientoPorLitro: rendimientoPorLitroComparar
        }
      });

      // Calcular diferencias porcentuales
      const diferenciaPrecio = ((costoPorLitroComparar - costoPorLitroEstrella) / costoPorLitroEstrella) * 100;
      
      // Calcular diferencia de rendimiento: (estrella - comparado) / comparado * 100
      // Esto muestra cuánto más rinde el producto estrella comparado con el otro
      const diferenciaRendimiento = rendimientoPorLitroEstrella > 0 && rendimientoPorLitroComparar > 0
        ? ((rendimientoPorLitroEstrella - rendimientoPorLitroComparar) / rendimientoPorLitroComparar) * 100
        : 0;

      console.log('📈 useComparativa - Diferencias calculadas:', {
        diferenciaPrecio,
        diferenciaRendimiento,
        rendimientoEstrella: rendimientoPorLitroEstrella,
        rendimientoComparado: rendimientoPorLitroComparar
      });

      const resultados: ResultadoComparativa[] = [
        {
          producto: {
            ...productoEstrella,
            precio: precioEstrella.precio,
            presentacionEnLitros: productoEstrella.presentacionEnLitros,
            rendimientoPorLitro: rendimientoPorLitroEstrella
          },
          costoPorLitro: costoPorLitroEstrella,
          diferenciaPrecio: 0,
          diferenciaRendimiento: 0,
          necesitaPrecio: false
        },
        {
          producto: {
            ...productoSeleccionado,
            precio: precioComparar.precio,
            presentacionEnLitros: productoSeleccionado.presentacionEnLitros,
            rendimientoPorLitro: rendimientoPorLitroComparar
          },
          costoPorLitro: costoPorLitroComparar,
          diferenciaPrecio,
          diferenciaRendimiento,
          necesitaPrecio: false
        }
      ];

      console.log('✅ useComparativa - Resultados calculados:', resultados);
      setComparativa(resultados);
      setMostrarComparativa(true);
    } catch (error) {
      console.error('❌ useComparativa - Error al calcular comparativa:', error);
      setComparativa([]);
      setMostrarComparativa(false);
    } finally {
      setIsCalculando(false);
      console.log('🏁 useComparativa - Cálculo finalizado');
    }
  }, [productoEstrella, productoSeleccionado, isLoading, getProductPrice, productPrices]);

  useEffect(() => {
    console.log('🔍 [useComparativa] useEffect disparado');
    console.log('  productoSeleccionado:', productoSeleccionado);
    console.log('  productoEstrella:', productoEstrella);
    console.log('  isLoading:', isLoading);

    if (
      productoSeleccionado &&
      productoEstrella &&
      isLoading === false
    ) {
      const precioEstrella = getProductPrice(productoEstrella);
      const precioComparar = getProductPrice(productoSeleccionado);

      console.log('  precioEstrella:', precioEstrella);
      console.log('  precioComparar:', precioComparar);

      // Solo calcular si ambos precios son válidos
      if (
        precioEstrella && precioEstrella.precio > 0 &&
        precioComparar && precioComparar.precio > 0
      ) {
        console.log('✅ Ambos precios válidos, calculando comparativa...');
        calcularComparativa();
      } else {
        console.warn('⚠️ Falta precio válido en alguno de los productos. No se calcula comparativa.');
        setComparativa([]);
        setMostrarComparativa(false);
      }
    } else {
      console.warn('⚠️ Faltan datos para calcular comparativa.');
      setComparativa([]);
      setMostrarComparativa(false);
    }
    // Solo depende de los datos, no de la función calcularComparativa
  }, [productoSeleccionado, productoEstrella, isLoading, getProductPrice, productPrices]);

  const refreshTable = useCallback(() => {
    console.log('🔄 useComparativa - refreshTable llamado, forzando recálculo');
    if (productoSeleccionado && productoEstrella) {
      calcularComparativa();
    }
  }, [productoSeleccionado, productoEstrella, calcularComparativa]);

  return {
    comparativa,
    mostrarComparativa,
    isCalculando,
    refreshTable
  };
};