import React, { useEffect } from 'react';
import { 
  Box,
  Typography,
  CircularProgress,
  useTheme,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useComparativa } from '../../hooks';
import { SelectProductos } from '../SelectProductos/SelectProductos';
import { ProductoFijo } from '../StaticItem/StaticItem';
import { 
  CalculatorContainer, 
  CalculatorHeader, 
  MedicalCalculator, 
  ProductoEstrellaContainer,
} from '../../styles';
import { CalculadoraProps } from '../../interfaces/Calculadora.types';
import { DataTable, TableCellStyled, StyledRow } from '../TablaComparacion/TablaComparacion';
import { StarProductCell } from '../StarProductCell';
import { RecomendacionCompra } from '../RecomendationCard/RecomendationCard';
import { Producto } from '../../interfaces/interfaces';

export const Calculadora: React.FC<CalculadoraProps> = ({
  productosDisponibles,
  productoEstrella,
  onEditProduct,
  onSelectProduct,
  isLoading,
  getProductPrice,
  productPrices,
  productoSeleccionado
}) => {
  const theme = useTheme();
  const {
    comparativa,
    mostrarComparativa,
    isCalculando,
    refreshTable
  } = useComparativa(
    isLoading,
    productoEstrella || null,
    productoSeleccionado || null,
    getProductPrice,
    productPrices
  );

  const formatARS = (value: number) => {
    return value.toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Función para formatear porcentajes con máximo 2 decimales
  const formatPorcentaje = (value: number) => {
    return value.toFixed(2).replace(/\.?0+$/, ''); // Elimina ceros innecesarios al final
  };

  const columns = [
    { text: 'Producto', align: 'left' as const, width: '25%' },
    { text: 'Litros', align: 'center' as const, width: '15%' },
    { text: 'Precio por litro', align: 'center' as const, width: '20%' },
    { text: 'Diferencia de precio', align: 'center' as const, width: '20%' },
    { text: 'Diferencia de rendimiento', align: 'center' as const, width: '20%' },
    { text: 'Modificar', align: 'center' as const, width: '15%' },
  ];

  // Función que maneja la selección de productos
  const handleSelectProduct = async (producto: Producto) => {
    console.log('🎯 Calculadora - handleSelectProduct:', producto.nombre);
    
    // Llamar al método de CalculatorPage que maneja el SweetAlert
    await onSelectProduct(producto);
  };

  // Función que maneja la edición de productos y actualiza la tabla
  const handleEditProduct = (producto: Producto) => {
    console.log('🔄 Calculadora - handleEditProduct:', producto.nombre);
    onEditProduct(producto);
    // Después de editar, refrescar la tabla
    setTimeout(() => {
      refreshTable();
    }, 100);
  };

  useEffect(() => {
    console.log('🔄 Calculadora - Renderizando con props:', {
      productosDisponibles: productosDisponibles.length,
      tieneProductoEstrella: !!productoEstrella,
      isLoading,
      onSelectProduct: !!onSelectProduct,
      comparativa: comparativa.length,
      mostrarComparativa,
      productoSeleccionado: !!productoSeleccionado,
      productoSeleccionadoNombre: productoSeleccionado?.nombre
    });
    
    console.log('📊 Calculadora - Estado de la comparativa:', {
      comparativa,
      mostrarComparativa,
      isCalculando
    });
  }, [productosDisponibles, productoEstrella, isLoading, onSelectProduct, comparativa, mostrarComparativa, productoSeleccionado, isCalculando]);

  return (
    <CalculatorContainer>
      <CalculatorHeader>
        <Typography variant="h4" component="h1" gutterBottom>
          Calculadora de Rendimientos
        </Typography>
      </CalculatorHeader>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
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
                  producto={productoEstrella}
                  size="medium"
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    border: '1px solid #010101',
                    borderRadius: 8,
                    padding: 2,
                    width: '100%'
                  }}
                  showBadge
                  getProductPrice={getProductPrice}
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
                productoSeleccionado={productoSeleccionado || undefined}
                onSeleccionar={handleSelectProduct}
                getProductPrice={getProductPrice}
              />
            </Box>
          </Box>

          {productoSeleccionado && (
            <Box mt={4}>
              {isCalculando ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                </Box>
              ) : mostrarComparativa && comparativa && comparativa.length > 0 ? (
                <>
                  <Typography variant="h6" color="primary" textAlign="center" gutterBottom>
                    Resultados de comparación
                  </Typography>
                  <DataTable columns={columns} isLoading={isLoading} maxHeight={500}>
                    {comparativa.map((item, index) => {
                      const esProductoPropio = item.producto.id === 1;
                      const isFirstItem = index === 0;

                      return (
                        <StyledRow
                          key={item.producto.id}
                          className={`${isFirstItem ? 'active-row' : ''}`}
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
                            {formatPorcentaje(item.diferenciaPrecio)}%
                          </TableCellStyled>

                          <TableCellStyled
                            align="center"
                            className={item.diferenciaRendimiento >= 0 ? 'highlight-positive' : 'highlight-negative'}
                          >
                            {item.diferenciaRendimiento >= 0 ? '+' : ''}
                            {formatPorcentaje(item.diferenciaRendimiento)}%
                          </TableCellStyled>

                          <TableCellStyled align="center">
                            {!esProductoPropio && (
                              <IconButton
                                aria-label="editar"
                                size="small"
                                onClick={() => handleEditProduct(item.producto)}
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
                    productoComparado={productoSeleccionado}
                    resultados={comparativa}
                  />
                </>
              ) : null}
            </Box>
          )}
        </MedicalCalculator>
      )}
    </CalculatorContainer>
  );
};