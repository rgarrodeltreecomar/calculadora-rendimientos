import { AppBar, ListItemButton, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { LinkProps } from 'react-router-dom';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  zIndex: theme.zIndex.drawer + 1,
}));

export const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#052154',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  transition: 'all 0.3s ease',
  borderBottom: '3px solid transparent',
  '&:hover': {
    color: '#003daf',
    borderBottomColor: '#003daf',
  },
}));

export const SubmenuLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 3),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#F4F7FC',
    color: '#003daf',
  },
}));

export const HighlightButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'to',
})<LinkProps & { component?: React.ElementType }>(({ theme }) => ({
  backgroundColor: '#F4F7FC',
  borderRadius: '6px',
  marginLeft: theme.spacing(1),
  color: '#003daf',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#E0E8F5',
  },
}));