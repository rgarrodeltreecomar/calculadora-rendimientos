interface ProductoImagenProps {
    foto: string | File | undefined;
    alt: string;
    className?: string;
  }
  
  export const ProductoImagen = ({ foto, alt, className }: ProductoImagenProps) => {
    if (!foto) {
      return (
        <div className={`producto-imagen-default ${className}`}>
          <i className="icon-cube"></i>
        </div>
      );
    }
  
    const src = typeof foto === 'string' ? foto : URL.createObjectURL(foto);
  
    return (
      <img 
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/imagenes/producto-default.jpg';
        }}
      />
    );
  };
  
