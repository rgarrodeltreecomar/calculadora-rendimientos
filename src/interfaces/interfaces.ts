export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  foto?: string;
  presentacionEnLitros: number;
  dilucionDeUsoMaxima: number;
  precio: number;
  rendimientoPorLitro?: number;
}