import { ComparativaResultado } from "../interfaces/Calculadora.types";

export const getProductoConMejorRendimiento = (resultados: ComparativaResultado[]) => {
  if (resultados.length < 2) return null;
  
  const [estrella, comparado] = resultados;
  
  if (!estrella.producto.rendimientoPorLitro || !comparado.producto.rendimientoPorLitro) {
    return null;
  }
  
  return comparado.diferenciaRendimiento > 0 ? comparado : estrella;
};