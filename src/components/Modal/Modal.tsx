import React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,

  Avatar,
  Paper,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Producto } from '../../interfaces/interfaces';
import { useForm } from '../../hooks/useForm';
import { ButtonCustom, CustomGrid } from '../../components'





interface EditProductModalProps {
  producto: Producto;
  onSave: (updatedProduct: Omit<Producto, 'precioPorLitro'>) => void;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  producto,
  onSave,
  onClose,
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
      precio: editedProduct.precio,
      presentacionEnLitros: editedProduct.presentacionEnLitros
    });
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          background: '#fafafa',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <EditIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Editar producto
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <CustomGrid container spacing={3}>
        <CustomGrid item xs={12} sm={4}>
            <Box display="flex" justifyContent="center">
              <Avatar
                src={producto.foto || '/default-product.png'}
                alt={producto.nombre}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 3,
                  border: '2px solid #eee',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                variant="rounded"
              />
            </Box>
          </CustomGrid>

          <CustomGrid item xs={12} sm={8}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: '#fff' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Precio actual: <strong>${producto.precio.toFixed(2)}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Nuevo precio total"
                name="precio"
                type="number"
                value={editedProduct.precio}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                  inputProps: {
                    min: 0,
                    step: "0.01"
                  }
                }}
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Presentación actual: <strong>{producto.presentacionEnLitros} Litro(s)</strong>
              </Typography>

              <Select
                fullWidth
                name="presentacionEnLitros"
                value={String(editedProduct.presentacionEnLitros)}
                onChange={handleSelectChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value={1}>1 Litro</MenuItem>
                <MenuItem value={3}>3 Litros</MenuItem>
                <MenuItem value={5}>5 Litros</MenuItem>
              </Select>

              <Typography variant="caption" color="text.secondary">
                Precio por litro: <strong>${(editedProduct.precio / Number(editedProduct.presentacionEnLitros)).toFixed(2)}/L</strong>
              </Typography>
            </Paper>
          </CustomGrid>
        </CustomGrid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <ButtonCustom onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </ButtonCustom>
        <ButtonCustom
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={!editedProduct.precio || editedProduct.precio <= 0}
        >
          Guardar Cambios
        </ButtonCustom>
      </DialogActions>
    </Dialog>
  );
};
