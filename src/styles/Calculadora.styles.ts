import { styled } from '@mui/material/styles';
import { Paper, Box, Badge, Typography } from '@mui/material';

export const CalculatorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 4,
  marginBottom: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
  transition: 'box-shadow 0.3s ease, transform 0.2s ease',
  willChange: 'transform, box-shadow',
  '&:hover': {
    boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
  },
}));


export const CalculatorHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  
  '& .MuiTypography-h4': {
    fontWeight: 700,
    letterSpacing: '0.4px',
    marginBottom: theme.spacing(1),
    fontSize: '2rem',
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.6rem',
    },
  },

  '& .MuiTypography-subtitle1': {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem',
    lineHeight: 1.6,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
}));


export const MedicalCalculator = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2.5,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  transition: 'box-shadow 0.25s ease, transform 0.25s ease',

  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
  },

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));


export const ProductoEstrellaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& .MuiTypography-h6': {
    fontWeight: 600,
    color: theme.palette.primary.dark,
    alignSelf: 'flex-start',
  },
}));




export const GridHeaderCell = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const GridCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.shape.borderRadius,
  minHeight: '60px',
  background: theme.palette.background.default,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

export const EstrellaBadge = styled(Badge)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.getContrastText(theme.palette.warning.dark),
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: theme.spacing(0.5),
    top: 8,
    right: -20,
    borderRadius: 4,
    minWidth: 24,
    height: 20,
    letterSpacing: '0.5px',
  },
}));