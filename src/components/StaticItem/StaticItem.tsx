import { Producto } from '../../interfaces/interfaces';
import { ProductPrice } from '../../hooks/useProductPrices';
import { ProductoImagen } from '../ProductoImagen';
import { Box, Typography, SxProps, Theme } from '@mui/material';

interface ProductoFijoProps {
  producto: Producto;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showBadge?: boolean;
  badgeText?: string;
  getProductPrice?: (producto: Producto) => ProductPrice | undefined;
  sx?: SxProps<Theme>;
}

export const ProductoFijo = ({
  producto,
  className = '',
  size = 'medium',
  showBadge = false,
  badgeText = 'Recomendado',
  getProductPrice,
  sx
}: ProductoFijoProps) => {
  const sizeClasses = {
    small: 'producto-fijo-small',
    medium: 'producto-fijo-medium',
    large: 'producto-fijo-large'
  };

  // Función para obtener la URL de la imagen
  const getImageUrl = () => {
    if (typeof producto.foto === 'string') {
      return producto.foto;
    } else if (producto.foto && typeof producto.foto === 'object') {
      return URL.createObjectURL(producto.foto as Blob);
    }
    return '';
  };

  const formatARS = (value: number) => {
    return value.toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const precioProducto = getProductPrice?.(producto);

  return (
    <Box className={`producto-fijo-container ${className}`} sx={sx}>
      <div className="producto-fijo-content">
        <ProductoImagen 
          foto={getImageUrl()}
          alt={producto.nombre || ''}
          className={`producto-fijo-imagen ${sizeClasses[size]}`}
        />
        <div className="producto-fijo-info">
          <h4>{producto.nombre}</h4>
          {producto.descripcion && <p>{producto.descripcion}</p>}
          {precioProducto && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                ${formatARS(precioProducto.precio)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {precioProducto.presentacionEnLitros}L - ${formatARS(precioProducto.precio / precioProducto.presentacionEnLitros)}/L
              </Typography>
            </Box>
          )}
          {showBadge && <span className="producto-fijo-badge">{badgeText}</span>}
        </div>
      </div>
    </Box>
  );
};