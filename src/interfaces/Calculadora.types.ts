import { Producto } from "./interfaces";

export interface CalculadoraProps {
  productosDisponibles: Producto[];
  productoEstrella: Producto | undefined;
  onEditProduct: (producto: Producto) => void;
  isLoading: boolean;
}

export interface ComparativaResultado {
  producto: Producto;
  costoPorLitro: number;
  diferenciaPrecio: number;
  diferenciaRendimiento: number;
}