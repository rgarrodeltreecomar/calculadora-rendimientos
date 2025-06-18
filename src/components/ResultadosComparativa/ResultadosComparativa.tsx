import React from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { DataTable, TableCellStyled, StyledRow } from '../TablaComparacion/TablaComparacion';
import { Producto } from '../../interfaces/interfaces';
import { ResultadoComparativa } from '../../hooks/useComparativa';

interface ResultadosComparativaProps {
  resultados: ResultadoComparativa[];
  columns: {
    text: string;
    align: 'left' | 'center' | 'right';
    width: string;
  }[];
  onEditProduct: (producto: Producto) => void;
  necesitaPrecio: (producto: Producto) => boolean;
}

export const ResultadosComparativa: React.FC<ResultadosComparativaProps> = ({
  resultados,
  columns,
  onEditProduct,
  necesitaPrecio
}) => {
  const theme = useTheme();

  const formatARS = (value: number) => {
    return value.toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Box>
      <Typography variant="h6" color="primary" textAlign="center" gutterBottom>
        Resultados de comparación
      </Typography>

      <DataTable columns={columns}>
        {resultados.map((item, index) => {
          const esProductoPropio = item.producto.id === 1;
          const isFirstItem = index === 0;
          const necesitaPrecioProducto = necesitaPrecio(item.producto);

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">
                    {item.producto.nombre}
                  </Typography>
                  {necesitaPrecioProducto && (
                    <Typography variant="caption" color="warning.main">
                      (Necesita precio)
                    </Typography>
                  )}
                </Box>
              </TableCellStyled>

              <TableCellStyled align="center">
                {item.producto.presentacionEnLitros} L
              </TableCellStyled>

              <TableCellStyled align="center">
                {necesitaPrecioProducto ? (
                  <Typography variant="body2" color="warning.main">
                    Necesita precio
                  </Typography>
                ) : (
                  `$${formatARS(item.costoPorLitro)}`
                )}
              </TableCellStyled>

              <TableCellStyled
                align="center"
                className={item.diferenciaPrecio >= 0 ? 'highlight-negative' : 'highlight-positive'}
              >
                {necesitaPrecioProducto ? (
                  '-'
                ) : (
                  `${item.diferenciaPrecio >= 0 ? '+' : ''}${item.diferenciaPrecio}%`
                )}
              </TableCellStyled>

              <TableCellStyled
                align="center"
                className={item.diferenciaRendimiento >= 0 ? 'highlight-positive' : 'highlight-negative'}
              >
                {necesitaPrecioProducto ? (
                  '-'
                ) : (
                  `${item.diferenciaRendimiento >= 0 ? '+' : ''}${item.diferenciaRendimiento}%`
                )}
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
    </Box>
  );
}; 