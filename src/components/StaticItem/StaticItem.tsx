import { SxProps, Theme } from "@mui/material";
import { ProductoImagen } from "../ProductoImagen";

interface ProductoFijoProps {
    producto: {
      id: number;
      foto: string | File;
      nombre: string;
      descripcion?: string;
    };
    className?: string;
    size?: 'small' | 'medium' | 'large';
    sx?: SxProps<Theme>;
    showBadge?: boolean;
    badgeText?: string;
  }
  export const ProductoFijo = ({
    producto,
    className = '',
    size = 'medium',
    showBadge = false,
    badgeText = 'Recomendado'
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
      } else {
        return URL.createObjectURL(producto.foto);
      }
    };
  
    return (
      <div className={`producto-fijo-container ${className}`}>
        <div className="producto-fijo-content">
          <ProductoImagen 
            foto={getImageUrl()}
            alt={producto.nombre}
            className={`producto-fijo-imagen ${sizeClasses[size]}`}
          />
          <div className="producto-fijo-info">
            <h4>{producto.nombre}</h4>
            {producto.descripcion && <p>{producto.descripcion}</p>}
            {showBadge && <span className="producto-fijo-badge">{badgeText}</span>}
          </div>
        </div>
      </div>
    );
  };