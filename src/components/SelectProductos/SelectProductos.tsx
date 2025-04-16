import { useState, useRef, useEffect } from 'react';
import { 
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Collapse,
  Divider,
  useTheme
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Producto } from '../../interfaces/interfaces';

interface SelectProductosProps {
  productos: Producto[];
  productoSeleccionado: Producto | undefined;
  onSeleccionar: (producto: Producto) => void;
}

export const SelectProductos = ({
  productos,
  productoSeleccionado,
  onSeleccionar
}: SelectProductosProps) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('Productos recibidos en SelectProductos:', productos);
  }, [productos]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <Box 
      ref={dropdownRef}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 500,
        my: 2
      }}
    >
      <Paper
        elevation={isOpen ? 3 : 1}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: theme.palette.text.secondary
          }
        }}
        onClick={toggleDropdown}
      >
        {productoSeleccionado ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={productoSeleccionado.foto} 
              alt={productoSeleccionado.nombre}
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="body1">
              {productoSeleccionado.nombre}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Selecciona un producto
          </Typography>
        )}
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </Paper>

      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 300,
            overflow: 'auto',
            zIndex: theme.zIndex.modal,
            mt: 0.5
          }}
        >
          <List dense>
            {productos.map((producto) => (
              <div key={producto.id}>
                <ListItem
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    },
                    backgroundColor: productoSeleccionado?.id === producto.id 
                      ? theme.palette.action.selected 
                      : 'inherit'
                  }}
                  onClick={() => {
                    onSeleccionar(producto);
                    setIsOpen(false);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={producto.foto} 
                      alt={producto.nombre}
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={producto.nombre}
                    secondary={producto.descripcion}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: productoSeleccionado?.id === producto.id 
                        ? 'bold' 
                        : 'normal'
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      variant: 'caption'
                    }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
};