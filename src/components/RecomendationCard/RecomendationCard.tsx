import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResultadoComparativa } from '../../hooks/useComparativa';
import { Producto } from '../../interfaces/interfaces';
import { CheckCircle, Warning, Info } from '@mui/icons-material';

interface RecomendacionCompraProps {
  productoEstrella?: Producto;
  productoComparado?: Producto;
  resultados: ResultadoComparativa[];
}

export const RecomendacionCompra: React.FC<RecomendacionCompraProps> = ({
  productoEstrella,
  productoComparado,
  resultados
}) => {
  const theme = useTheme();

  if (resultados.length < 2 || !productoEstrella || !productoComparado) return null;

  // Extraer datos de la comparación
  const diferenciaPrecio = resultados[1].diferenciaPrecio;
  const diferenciaRendimiento = resultados[1].diferenciaRendimiento;
  
  // Función para formatear números con máximo 2 decimales
  const formatearNumero = (valor: number): string => {
    return valor.toFixed(2).replace(/\.?0+$/, ''); // Elimina ceros innecesarios al final
  };

  // Función para formatear porcentajes
  const formatearPorcentaje = (valor: number): string => {
    return formatearNumero(valor);
  };

  // Función para formatear litros
  const formatearLitros = (valor: number): string => {
    const redondeado = Math.round(valor * 100) / 100;
    return redondeado
      .toLocaleString('es-AR', {
        minimumFractionDigits: redondeado % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })
      .replace(/,/g, '.');
  };

  // Mejorar la lógica de determinación de mejor opción
  // diferenciaRendimiento > 0 significa que el producto estrella rinde más
  const esMejorOpcion = diferenciaPrecio < 0 && diferenciaRendimiento < 0; // Comparado es más barato y rinde más
  const esMejorEstrella = diferenciaPrecio > 0 && diferenciaRendimiento > 0; // Estrella es más barato y rinde más
  const esEmpateTecnico = Math.abs(diferenciaPrecio) < 5 && Math.abs(diferenciaRendimiento) < 5;
  
  // Casos mixtos más específicos
  const esMasBaratoPeroMenosRendimiento = diferenciaPrecio < 0 && diferenciaRendimiento > 0; // Comparado es más barato pero estrella rinde más
  const esMasCaroPeroMasRendimiento = diferenciaPrecio > 0 && diferenciaRendimiento < 0; // Estrella es más caro pero comparado rinde más

  // Calcular litros de diferencia usando los valores calculados del hook
  const litrosEstrella = resultados[0]?.producto.rendimientoPorLitro || 0;
  const litrosComparado = resultados[1]?.producto.rendimientoPorLitro || 0;
  const diferenciaLitros = Math.abs(litrosEstrella - litrosComparado);

  console.log('📊 RecomendacionCompra - Valores de rendimiento:', {
    litrosEstrella,
    litrosComparado,
    diferenciaLitros,
    diferenciaRendimiento
  });

  // Determinar recomendación mejorada
  const getRecomendacion = () => {
    if (esEmpateTecnico) {
      return {
        texto: "Ambos productos son muy similares en precio y rendimiento",
        icono: <Info color="info" sx={{ mr: 1 }} />,
        color: theme.palette.info.main
      };
    }
    
    if (esMejorOpcion) {
      return {
        texto: `Recomendamos comprar ${productoComparado.nombre} - es más económico y rinde más`,
        icono: <CheckCircle color="success" sx={{ mr: 1 }} />,
        color: theme.palette.success.main
      };
    }
    
    if (esMejorEstrella) {
      return {
        texto: `Recomendamos comprar ${productoEstrella.nombre} - es más económico y rinde más`,
        icono: <CheckCircle color="success" sx={{ mr: 1 }} />,
        color: theme.palette.success.main
      };
    }
    
    // Casos mixtos con recomendaciones más específicas
    if (esMasBaratoPeroMenosRendimiento) {
      const porcentajeAhorro = Math.abs(diferenciaPrecio);
      const porcentajePerdidaRendimiento = Math.abs(diferenciaRendimiento);
      
      if (porcentajeAhorro > porcentajePerdidaRendimiento * 2) {
        return {
          texto: `Recomendamos ${productoComparado.nombre} - el ahorro compensa la pérdida de rendimiento`,
          icono: <CheckCircle color="success" sx={{ mr: 1 }} />,
          color: theme.palette.success.main
        };
      } else {
        return {
          texto: `${productoComparado.nombre} es más económico pero ${productoEstrella.nombre} rinde más`,
          icono: <Warning color="warning" sx={{ mr: 1 }} />,
          color: theme.palette.warning.main
        };
      }
    }
    
    if (esMasCaroPeroMasRendimiento) {
      const porcentajeCostoExtra = diferenciaPrecio;
      const porcentajeGananciaRendimiento = Math.abs(diferenciaRendimiento);
      
      if (porcentajeGananciaRendimiento > porcentajeCostoExtra * 1.5) {
        return {
          texto: `Recomendamos ${productoComparado.nombre} - el rendimiento extra compensa el costo adicional`,
          icono: <CheckCircle color="success" sx={{ mr: 1 }} />,
          color: theme.palette.success.main
        };
      } else {
        return {
          texto: `${productoComparado.nombre} rinde más pero ${productoEstrella.nombre} es más económico`,
          icono: <Warning color="warning" sx={{ mr: 1 }} />,
          color: theme.palette.warning.main
        };
      }
    }
    
    return {
      texto: `${productoComparado.nombre} rinde más pero es más caro`,
      icono: <Warning color="warning" sx={{ mr: 1 }} />,
      color: theme.palette.warning.main
    };
  };

  const recomendacion = getRecomendacion();

  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        borderLeft: `4px solid ${recomendacion.color}`,
        '& .comparison-list': {
          pl: 3,
          '& li': {
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '"•"',
              color: theme.palette.primary.main,
              mr: 1.5,
              fontSize: '1.2rem'
            },
            '& strong': {
              color: 'text.primary',
              mr: 0.5
            }
          }
        },
        '& .highlight': {
          bgcolor: 'primary.light',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          display: 'inline-block',
          fontWeight: 'bold'
        },
        '& .litros-diff': {
          fontWeight: 'bold',
          color: theme.palette.secondary.main
        }
      }}
    >
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
        {recomendacion.icono}
        Recomendación de compra
      </Typography>
      
      <Typography variant="body1" paragraph>
        Comparando <strong>{productoEstrella.nombre}</strong> con <strong>{productoComparado.nombre}</strong>:
      </Typography>
      
      <Box component="ul" className="comparison-list">
        <li>
          <strong>Precio:</strong> 
          {diferenciaPrecio < 0 ? (
            <span>{productoComparado.nombre} es <span className="highlight">{formatearPorcentaje(Math.abs(diferenciaPrecio))}% más económico</span></span>
          ) : (
            <span>{productoEstrella.nombre} es <span className="highlight">{formatearPorcentaje(diferenciaPrecio)}% más económico</span></span>
          )}
        </li>
        
        <li>
          <strong>Rendimiento:</strong> 
          {diferenciaRendimiento > 0 ? (
            <span>{productoEstrella.nombre} rinde <span className="litros-diff">{formatearLitros(diferenciaLitros)}L más</span> ({formatearPorcentaje(diferenciaRendimiento)}% mejor)</span>
          ) : (
            <span>{productoComparado.nombre} rinde <span className="litros-diff">{formatearLitros(diferenciaLitros)}L más</span> ({formatearPorcentaje(Math.abs(diferenciaRendimiento))}% mejor)</span>
          )}
        </li>
        
        <li>
          <strong>Relación precio-rendimiento:</strong> 
          {esMejorOpcion ? (
            <span className="highlight">Excelente relación calidad-precio a favor de {productoComparado.nombre}</span>
          ) : esMejorEstrella ? (
            <span className="highlight">Excelente relación calidad-precio a favor de {productoEstrella.nombre}</span>
          ) : esEmpateTecnico ? (
            <span>Relación similar en ambos productos</span>
          ) : esMasBaratoPeroMenosRendimiento ? (
            <span>Valorar si prefieres el ahorro ({formatearPorcentaje(Math.abs(diferenciaPrecio))}%) sobre el rendimiento</span>
          ) : (
            <span>Valorar si prefieres mejor rendimiento ({formatearPorcentaje(diferenciaRendimiento)}%) sobre el precio</span>
          )}
        </li>
      </Box>
      
      <Box sx={{ 
        mt: 3, 
        p: 2, 
        bgcolor: `${recomendacion.color}20`, 
        borderRadius: 1,
        borderLeft: `3px solid ${recomendacion.color}`
      }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: recomendacion.color }}>
          {recomendacion.texto}
        </Typography>
        
        {esMejorOpcion && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Por cada {formatearLitros(litrosEstrella)}L que rinde {productoEstrella.nombre}, {productoComparado.nombre} rinde {formatearLitros(litrosComparado)}L ({formatearLitros(diferenciaLitros)}L más) y cuesta {formatearPorcentaje(Math.abs(diferenciaPrecio))}% menos.
          </Typography>
        )}
        
        {esMejorEstrella && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Por cada {formatearLitros(litrosComparado)}L que rinde {productoComparado.nombre}, {productoEstrella.nombre} rinde {formatearLitros(litrosEstrella)}L ({formatearLitros(diferenciaLitros)}L más) y cuesta {formatearPorcentaje(diferenciaPrecio)}% menos.
          </Typography>
        )}
      </Box>
      
      {!esMejorOpcion && !esMejorEstrella && !esEmpateTecnico && (
        <Box sx={{ mt: 2, fontStyle: 'italic' }}>
          <Typography variant="body2">
            {diferenciaPrecio < 0 ? (
              `Si el precio es tu prioridad, ${productoComparado.nombre} es la mejor opción (ahorro del ${formatearPorcentaje(Math.abs(diferenciaPrecio))}%)`
            ) : (
              `Si el rendimiento es tu prioridad, ${productoEstrella.nombre} es la mejor opción (${formatearLitros(diferenciaLitros)}L más por cada ${formatearLitros(litrosComparado)}L)`
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
};