import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  useTheme,
  SxProps,
  Theme,
  IconButton,
  Fade,
  Badge,
  Chip,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Cancel,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { Producto } from '../../interfaces/interfaces';
import { ProductPrice } from '../../hooks/useProductPrices';
import { CustomGrid } from '../CustomGrid/CustomGrid';

interface SelectProductosProps {
  productos: Producto[];
  productoSeleccionado: Producto | undefined;
  onSeleccionar: (producto: Producto) => void;
  getProductPrice?: (producto: Producto) => ProductPrice | undefined;
  necesitaPrecio?: (producto: Producto) => boolean;
  sx?: SxProps<Theme>;
}

export const SelectProductos = ({
  productos,
  productoSeleccionado,
  onSeleccionar,
  getProductPrice,
  necesitaPrecio,
  sx
}: SelectProductosProps) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredProducts = productos
    .filter(producto => producto.id !== 1)
    .filter(producto =>
      producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (producto: Producto) => {
    console.log('🎯 SelectProductos - handleSelect iniciado');
    console.log('📦 Producto seleccionado:', {
      id: producto.id,
      nombre: producto.nombre,
      necesitaPrecio: necesitaPrecio?.(producto)
    });
    onSeleccionar(producto);
    setIsOpen(false);
    setSearchTerm('');
  };

  const formatARS = (value: number | undefined) => {
    if (typeof value !== 'number') return '0,00';
    return value.toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getProductDisplayPrice = (producto: Producto) => {
    if (!getProductPrice) return '0,00';
    const precio = getProductPrice(producto);
    return precio ? formatARS(precio.precio) : '0,00';
  };

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '97%',
        ...sx
      }}
    >
      <Paper
        elevation={isOpen ? 3 : 1}
        onClick={toggleDropdown}
        sx={{
          width: '100%',
          p: 2,
          borderRadius: '12px',
          backgroundColor: theme.palette.background.paper,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${isOpen ? theme.palette.primary.main : theme.palette.divider}`,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {productoSeleccionado ? (
            <Box display="flex" alignItems="center" gap={2} flex={1}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Avatar sx={{ 
                    width: 24, 
                    height: 24,
                    bgcolor: theme.palette.success.main,
                    border: `2px solid ${theme.palette.background.paper}`
                  }}>
                    <CheckCircle sx={{ fontSize: 16 }} />
                  </Avatar>
                }
              >
                <Avatar 
                  src={productoSeleccionado.foto} 
                  alt={productoSeleccionado.nombre}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    boxShadow: theme.shadows[2]
                  }}
                />
              </Badge>
              <Box flex={1} minWidth={0}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="600"
                  noWrap
                  sx={{
                    color: theme.palette.text.primary,
                    mb: 0.5
                  }}
                >
                  {productoSeleccionado.nombre}
                </Typography>
                <Typography 
                  variant="body2" 
                  noWrap
                  sx={{
                    color: theme.palette.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <span>{productoSeleccionado.descripcion?.substring(0, 40)}...</span>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: theme.palette.text.secondary,
                flex: 1
              }}
            >
              Selecciona un producto para comparar
            </Typography>
          )}
          
          <Box 
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isOpen ? theme.palette.primary.light : theme.palette.action.hover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              ml: 2
            }}
          >
            {isOpen ? (
              <ExpandLess sx={{ color: theme.palette.primary.main }} />
            ) : (
              <ExpandMore sx={{ color: theme.palette.text.secondary }} />
            )}
          </Box>
        </Box>
      </Paper>
   
      <Fade in={isOpen}>
        <Paper
          sx={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            right: 0,
            maxHeight: 'min(500px, 70vh)',
            overflow: 'hidden',
            zIndex: theme.zIndex.modal,
            borderRadius: '14px',
            boxShadow: theme.shadows[10],
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: 2,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1]
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <IconButton 
                    onClick={() => setSearchTerm('')}
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <Cancel fontSize="small" />
                  </IconButton>
                ),
                sx: {
                  borderRadius: '50px',
                  backgroundColor: theme.palette.background.default,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.divider
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '1px'
                  }
                }
              }}
            />
          </Box>
   
          <Box sx={{ 
            flex: 1,
            overflowY: 'auto',
            p: 2,
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.action.hover,
              borderRadius: '4px'
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.action.selected
            }
          }}>
            {filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((producto) => {
                  const isSelected = productoSeleccionado?.id === producto.id;
                  const precio = getProductDisplayPrice(producto);
                  const necesitaPrecioProducto = necesitaPrecio?.(producto);

                  return (
                    <CustomGrid item xs={12} sm={6} md={4} key={producto.id}>
                      <Box
                        onClick={(e) => {
                          console.log('🖱️ SelectProductos - Click en producto:', producto.nombre);
                          e.stopPropagation();
                          handleSelect(producto);
                        }}
                        sx={{
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      >
                        <Paper
                          elevation={isSelected ? 3 : 1}
                          sx={{
                            height: '100%',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: `2px solid ${
                              isSelected 
                                ? theme.palette.primary.main 
                                : 'transparent'
                            }`,
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: theme.shadows[6],
                              borderColor: theme.palette.primary.light
                            }
                          }}
                        >
                          <Box sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <Box sx={{
                              height: 140,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: theme.palette.background.default,
                              p: 2,
                              position: 'relative'
                            }}>
                              <Avatar
                                src={producto.foto}
                                alt={producto.nombre}
                                sx={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'contain',
                                  borderRadius: '8px'
                                }}
                                variant="rounded"
                              />
                              {isSelected && (
                                <Box sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  borderRadius: '50%',
                                  width: 28,
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: theme.shadows[2]
                                }}>
                                  <CheckCircle fontSize="small" />
                                </Box>
                              )}
                            </Box>
   
                            <Box sx={{
                              p: 2,
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight="600"
                                sx={{ mb: 1 }}
                              >
                                {producto.nombre}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  flex: 1
                                }}
                              >
                                {producto.descripcion}
                              </Typography>
                              {precio && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2" color="primary" fontWeight="bold">
                                    ${precio}
                                  </Typography>
                                </Box>
                              )}
                              {necesitaPrecioProducto && (
                                <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 1 }}>
                                  Necesita precio
                                </Typography>
                              )}
                              <Box sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <Chip 
                                  label="Comparar" 
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    </CustomGrid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ 
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 4
              }}>
                <Box sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.action.hover,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <Search sx={{ 
                    fontSize: 48, 
                    color: theme.palette.text.disabled 
                  }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No se encontraron productos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prueba con diferentes palabras clave
                </Typography>
                {searchTerm && (
                  <Button
                    onClick={() => setSearchTerm('')}
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Limpiar búsqueda
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};