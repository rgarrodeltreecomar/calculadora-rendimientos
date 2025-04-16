import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Producto } from '../../interfaces/interfaces';
import { useForm } from '../../hooks/useForm';

interface EditProductModalProps {
  producto: Producto;
  onSave: (updatedProduct: Omit<Producto, 'precioPorLitro'>) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ 
  producto, 
  onSave, 
  onClose 
}) => {
  const {
    formulario: editedProduct,
    handleInputChange,
    handleSelectChange,
  } = useForm<Omit<Producto, 'precioPorLitro'>>({ 
    ...producto
  });

  const handleSave = () => {
    onSave({
      ...editedProduct,
      // Solo enviamos los campos editables
      precio: editedProduct.precio,
      presentacionEnLitros: editedProduct.presentacionEnLitros
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <EditIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Editar Producto: {producto.nombre}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={2} mb={3}>
          <TextField
            fullWidth
            label="Precio total"
            name="precio"
            type="number"
            value={editedProduct.precio}
            onChange={handleInputChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              inputProps: { 
                min: 0,
                step: "0.01" // Para permitir decimales
              }
            }}
          />
          
          <Select
                fullWidth
                name="presentacionEnLitros"
                value={String(editedProduct.presentacionEnLitros)}
                onChange={handleSelectChange}
                sx={{ mb: 3 }}
              >
            <MenuItem value={1}>1 Litro</MenuItem>
            <MenuItem value={3}>3 Litros</MenuItem>
            <MenuItem value={5}>5 Litros</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary" 
          variant="contained"
          disabled={!editedProduct.precio || editedProduct.precio <= 0}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};