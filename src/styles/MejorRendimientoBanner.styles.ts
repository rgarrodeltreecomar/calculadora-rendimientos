import { Box, styled } from '@mui/material';

export const MejorRendimientoBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.success.light,
  borderLeft: `4px solid ${theme.palette.success.main}`,
  color: theme.palette.success.dark,
  borderRadius: theme.shape.borderRadius,
})); 