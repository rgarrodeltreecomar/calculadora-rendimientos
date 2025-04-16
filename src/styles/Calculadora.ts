import {  Paper,
  Chip,
  styled,
  Box} from '@mui/material'

export const CalculatorContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 900,
  margin: theme.spacing(4, 'auto'),
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: theme.shadows[4],
}));

export const CalculatorHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const MedicalCalculator = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: 10,
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.grey[300]}`,
}));

export const ResultadosGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 2fr 2fr 2fr 2fr 1fr',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(3),
}));

export const GridCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.common.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem',
}));

export const GridHeaderCell = styled(GridCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 600,
  textAlign: 'center',
}));

export const EstrellaBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.getContrastText(theme.palette.warning.light),
  marginLeft: theme.spacing(1),
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const ProductoEstrellaContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.light,
  borderRadius: 8,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

export const MejorRendimientoBanner = styled(Box)(({ theme }) => ({
  borderRadius: 8,
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));