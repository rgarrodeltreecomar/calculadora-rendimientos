import { Producto } from "./interfaces";
import { ProductPrice } from "../hooks/useProductPrices";

export interface CalculadoraProps {
  productosDisponibles: Producto[];
  productoEstrella: Producto | undefined;
  onEditProduct: (producto: Producto) => void;
  onSelectProduct: (producto: Producto) => void;
  isLoading: boolean;
  getProductPrice: (producto: Producto) => ProductPrice | undefined;
  productPrices: Record<number, ProductPrice>;
  productoSeleccionado: Producto | null;
}

export interface ComparativaResultado {
  producto: Producto;
  costoPorLitro: number;
  diferenciaPrecio: number;
  diferenciaRendimiento: number;
}