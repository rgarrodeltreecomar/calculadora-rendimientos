import { 
  Box,
  Typography,
  CircularProgress,
  useTheme,
  IconButton
} from '@mui/material';
import { Calculate as CalculatorIcon, EmojiEvents as TrophyIcon , Edit as EditIcon } from '@mui/icons-material';
import { useComparativa } from '../../hooks';
import { SelectProductos } from '../SelectProductos/SelectProductos';
import { ProductoFijo } from '../StaticItem/StaticItem';
import { CalculatorContainer, CalculatorHeader, EstrellaBadge, GridCell, GridHeaderCell, MedicalCalculator, MejorRendimientoBanner, ProductoEstrellaContainer, ResultadosGrid } from '../../styles/Calculadora';
import React, { useEffect } from 'react';
import { Producto } from '../../interfaces/interfaces';

interface CalculadoraProps {
  productosDisponibles: Producto[];
  productoEstrella: Producto | undefined;
  onEditProduct: (producto: Producto) => void;
  isLoading: boolean;
}

export const Calculadora: React.FC<CalculadoraProps> = ({
  productosDisponibles,
  productoEstrella,
  onEditProduct,
  isLoading
}) => {
  const theme = useTheme();
  const {
    comparativa,
    seleccionarProducto,
  } = useComparativa(productosDisponibles,  isLoading,  productoEstrella);

  const getProductoConMejorRendimiento = () => {
    if (comparativa.resultados.length < 2) return null;
    
    const [estrella, comparado] = comparativa.resultados;
    
    if (!estrella.producto.rendimientoPorLitro || !comparado.producto.rendimientoPorLitro) {
      return null;
    }
    
    return comparado.diferenciaRendimiento > 0 ? comparado : estrella;
  };

  const productoMejorRendimiento = getProductoConMejorRendimiento();

  useEffect(() => {
    console.log('Productos disponibles en Calculadora:', productosDisponibles);
    console.log('Producto estrella:', productoEstrella);
    console.log('Producto seleccionado:', comparativa.productoSeleccionado);
  }, [productosDisponibles, productoEstrella, comparativa.productoSeleccionado]);

  return (
    <CalculatorContainer elevation={3}>
      <CalculatorHeader>
        <Typography variant="h4" color="primary" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CalculatorIcon fontSize="large" />
          Comparativa de Productos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Compara nuestro producto estrella con otros productos
        </Typography>
      </CalculatorHeader>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={4}>
          <CircularProgress />
          <Typography variant="body1" ml={2}>Cargando productos...</Typography>
        </Box>
      ) : (
        <MedicalCalculator elevation={0}>
          {productoEstrella && (
            <ProductoEstrellaContainer>
              <Typography variant="h6" gutterBottom>
                Nuestro Producto
              </Typography>
              <ProductoFijo
                producto={{
                  id: productoEstrella.id || 1,
                  foto: productoEstrella.foto as string,
                  nombre: productoEstrella.nombre,
                }}
                size="medium"
                sx={{
                  backgroundColor: theme.palette.common.white,
                  border: '1px solid #aaff00',
                  borderRadius: 8,
                  padding: 2,
                }}
                showBadge
              />
            </ProductoEstrellaContainer>
          )}

<SelectProductos
      productos={productosDisponibles}  // Usamos los productos que vienen como prop
      productoSeleccionado={comparativa.productoSeleccionado}
      onSeleccionar={seleccionarProducto}
    />

          {productoMejorRendimiento && (
            <MejorRendimientoBanner sx={{
              backgroundColor: theme.palette.success.light,
              borderLeft: `4px solid ${theme.palette.success.main}`,
              color: theme.palette.success.dark,
            }}>
              <TrophyIcon fontSize="medium" />
              <Typography variant="body1">
                Mejor rendimiento: <strong>{productoMejorRendimiento.producto.nombre}</strong> 
                ({productoMejorRendimiento.producto.rendimientoPorLitro} m²/L)
              </Typography>
            </MejorRendimientoBanner>
          )}

          {comparativa.resultados.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" color="primary" textAlign="center" gutterBottom>
                Resultados de comparación
              </Typography>
              <ResultadosGrid>
                <GridHeaderCell>Producto</GridHeaderCell>
                <GridHeaderCell>Litros</GridHeaderCell>
                <GridHeaderCell>Precio por litro</GridHeaderCell>
                <GridHeaderCell>Diferencia de precio</GridHeaderCell>
                <GridHeaderCell>Diferencia de rendimiento</GridHeaderCell>
                <GridHeaderCell>Modificar</GridHeaderCell>
                {comparativa.resultados.map((item, index) => {
                  const esMejorRendimiento = productoMejorRendimiento?.producto.id === item.producto.id;
                  const esProductoPropio = item.producto.id === 1;
                  
                  return (
                    <React.Fragment key={item.producto.id}>
                      <GridCell sx={{
                        justifyContent: 'flex-start',
                        paddingLeft: 3,
                        backgroundColor: index === 0 ? theme.palette.primary.light : 'inherit',
                        fontWeight: index === 0 ? 500 : 'inherit',
                        position: 'relative',
                         border: esMejorRendimiento ? `2px solid ${theme.palette.success.main}` : 'none',
                        '&:before': index === 0 ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '2px 0 0 2px',
                        } : {}
                      }}>
                        {item.producto.nombre}
                        {index === 0 && <EstrellaBadge label="ESTRELLA" size="small" />}
                      </GridCell>
                      <GridCell>L {item.producto.presentacionEnLitros}</GridCell>
                      <GridCell>${item.costoPorLitro.toFixed(2)}</GridCell>
                      
                      <GridCell sx={{
                        color: item.diferenciaPrecio >= 0 ? theme.palette.error.main : theme.palette.success.main,
                        backgroundColor: item.diferenciaPrecio >= 0 ? theme.palette.error.light : theme.palette.success.light,
                      }}>
                        {item.diferenciaPrecio >= 0 ? '+' : ''}{item.diferenciaPrecio}%
                      </GridCell>
                      <GridCell sx={{
                        color: item.diferenciaRendimiento >= 0 ? theme.palette.success.main : theme.palette.error.main,
                        backgroundColor: item.diferenciaRendimiento >= 0 ? theme.palette.success.light : theme.palette.error.light,
                      }}>
                        {item.diferenciaRendimiento >= 0 ? '+' : ''}{item.diferenciaRendimiento}%
                      </GridCell>
                      <GridCell>
                      {!esProductoPropio && (
                          <IconButton 
                            aria-label="editar" 
                            size="small"
                            onClick={() => onEditProduct(item.producto)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                      </GridCell>
                    </React.Fragment>
                  );
                })}
              </ResultadosGrid>

              <Box mt={3} p={2} bgcolor={theme.palette.grey[50]} borderRadius={2} border={`1px solid ${theme.palette.grey[300]}`}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Precio por litro:</strong> Costo por litro de producto concentrado
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  <strong>Diferencia de precio:</strong> Comparación porcentual con el producto estrella
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  <strong>Diferencia de rendimiento:</strong> Comparación porcentual del rendimiento con el producto estrella
                </Typography>
              </Box>
            </Box>
          )}
        </MedicalCalculator>
      )}
    </CalculatorContainer>
  );
};