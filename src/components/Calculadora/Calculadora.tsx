import React, { useEffect } from 'react';
import { 
  Box,
  Typography,
  CircularProgress,
  useTheme,
  IconButton
} from '@mui/material';
import { Calculate as CalculatorIcon, Edit as EditIcon } from '@mui/icons-material';
import { useComparativa } from '../../hooks';
import { SelectProductos } from '../SelectProductos/SelectProductos';
import { ProductoFijo } from '../StaticItem/StaticItem';
import { 
  CalculatorContainer, 
  CalculatorHeader, 
  MedicalCalculator, 
  //MejorRendimientoBanner, 
  ProductoEstrellaContainer,
} from '../../styles';
import { CalculadoraProps } from '../../interfaces/Calculadora.types';
import { DataTable, TableCellStyled, StyledRow } from '../TablaComparacion/TablaComparacion';
import { StarProductCell } from '../StarProductCell';
import { RecomendacionCompra } from '../RecomendationCard/RecomendationCard';

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
  } = useComparativa(productosDisponibles, isLoading, productoEstrella);


  const formatARS = (value: number) => {
    return value.toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };


  const columns = [
    { text: 'Producto', align: 'left' as const, width: '25%' },
    { text: 'Litros', align: 'center' as const, width: '15%' },
    { text: 'Precio por litro', align: 'center' as const, width: '20%' },
    { text: 'Diferencia de precio', align: 'center' as const, width: '20%' },
    { text: 'Diferencia de rendimiento', align: 'center' as const, width: '20%' },
    { text: 'Modificar', align: 'center' as const, width: '15%' },
  ];

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
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'center', md: 'flex-start' }}
            gap={4}
            mb={4}
          >
            {productoEstrella && (
              <ProductoEstrellaContainer sx={{ 
                flex: 1,
                width: '100%',
                maxWidth: { xs: '100%', md: '50%' }
              }}>
                <Typography variant="h6" gutterBottom>
                  Nuestro Producto
                </Typography>
                <ProductoFijo
                  producto={{
                    id: productoEstrella.id || 1,
                    foto: productoEstrella.foto as string,
                    nombre: productoEstrella.nombre!,
                  }}
                  size="medium"
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    border: '1px solid #010101',
                    borderRadius: 8,
                    padding: 2,
                    width: '100%'
                  }}
                  showBadge
                />
              </ProductoEstrellaContainer>
            )}

            <Box sx={{ 
              flex: 1,
              width: '100%',
              maxWidth: { xs: '100%', md: '50%' }
            }}>
              <Typography variant="h6" gutterBottom>
                Comparar con
              </Typography>
              <SelectProductos
                productos={productosDisponibles}
                productoSeleccionado={comparativa.productoSeleccionado}
                onSeleccionar={seleccionarProducto}
              />
            </Box>
          </Box>

          {comparativa.resultados.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" color="primary" textAlign="center" gutterBottom>
                Resultados de comparación
              </Typography>
              
              <DataTable columns={columns} isLoading={isLoading} maxHeight={500}>
  {comparativa.resultados.map((item, index) => {
    const esProductoPropio = item.producto.id === 1;
    const isFirstItem = index === 0;

    return (
      <StyledRow
        key={item.producto.id}
        className={`${isFirstItem ? 'active-row' : ''}`} // Eliminado 'best-performance'
      >
        <TableCellStyled
          align="left"
          sx={{
            position: 'relative',
            '&:before': isFirstItem
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '2px 0 0 2px',
                }
              : {},
          }}
        >
          <StarProductCell 
            name={item.producto.nombre!} 
            isStar={isFirstItem} 
          />
        </TableCellStyled>

        <TableCellStyled align="center">
           {item.producto.presentacionEnLitros} L
        </TableCellStyled>

        <TableCellStyled align="center">
          ${formatARS(item.costoPorLitro)}
        </TableCellStyled>

        <TableCellStyled
          align="center"
          className={item.diferenciaPrecio >= 0 ? 'highlight-negative' : 'highlight-positive'}
        >
          {item.diferenciaPrecio >= 0 ? '+' : ''}
          {item.diferenciaPrecio}%
        </TableCellStyled>

        <TableCellStyled
          align="center"
          className={item.diferenciaRendimiento >= 0 ? 'highlight-positive' : 'highlight-negative'}
        >
          {item.diferenciaRendimiento >= 0 ? '+' : ''}
          {item.diferenciaRendimiento}%
        </TableCellStyled>

        <TableCellStyled align="center">
          {!esProductoPropio && (
            <IconButton
              aria-label="editar"
              size="small"
              onClick={() => onEditProduct(item.producto)}
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </TableCellStyled>
      </StyledRow>
    );
  })}
</DataTable>

        <RecomendacionCompra
          productoEstrella={productoEstrella}
          productoComparado={comparativa.productoSeleccionado}
          resultados={comparativa.resultados}
        />
            </Box>
          )}
        </MedicalCalculator>
      )}
    </CalculatorContainer>
  );
};