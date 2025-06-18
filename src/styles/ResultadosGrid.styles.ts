import { Box, styled } from '@mui/material';

export const ResultadosGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));