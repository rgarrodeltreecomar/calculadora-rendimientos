import { useState } from 'react';
import { 
  Toolbar,
  Container,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Business as CompanyIcon,
  MedicalServices as ProductsIcon,
  Build as ServicesIcon,
  People as RepresentationIcon,
  ContactMail as ContactIcon,
  Calculate as CalculatorIcon,
  LocalHospital as SurgeryIcon,
  MedicalInformation as DiagnosticIcon,
  MonitorHeart as MonitoringIcon,
  Construction as RentalIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { StyledAppBar,NavLink,HighlightButton,SubmenuLink } from '../../styles/Navbar';
import { Link } from 'react-router-dom';



export const Navbar = () => {
  const [openSubmenu, setOpenSubmenu] = useState<{
    productos: boolean;
    servicios: boolean;
  }>({
    productos: false,
    servicios: false,
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmenuToggle = (menu: 'productos' | 'servicios') => {
    setOpenSubmenu(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ width: '100%' }}>
            <List 
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                padding: 0,
              }}
            >
              {/* Inicio */}
              <ListItem disablePadding>
                <NavLink to="/">
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <HomeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Inicio" />
                </NavLink>
              </ListItem>
              
              {/* La Empresa */}
              <ListItem disablePadding>
                <NavLink to="/la-empresa">
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <CompanyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="La Empresa" />
                </NavLink>
              </ListItem>
              
              {/* Productos */}
              <ListItem 
                disablePadding
                onMouseEnter={!isMobile ? () => handleSubmenuToggle('productos') : undefined}
                onMouseLeave={!isMobile ? () => handleSubmenuToggle('productos') : undefined}
                sx={{ position: 'relative' }}
              >
                <NavLink 
                  to="#" 
                  onClick={isMobile ? () => handleSubmenuToggle('productos') : undefined}
                >
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <ProductsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Productos" />
                  {openSubmenu.productos ? <ExpandLess /> : <ExpandMore />}
                </NavLink>
                
                <Collapse 
                  in={openSubmenu.productos} 
                  timeout="auto" 
                  unmountOnExit
                  sx={{
                    position: { xs: 'static', md: 'absolute' },
                    top: '100%',
                    left: 0,
                    width: { xs: '100%', md: '220px' },
                    backgroundColor: '#FFFFFF',
                    borderRadius: { xs: 0, md: '0 0 8px 8px' },
                    boxShadow: { xs: 'none', md: '0 5px 15px rgba(0, 0, 0, 0.1)' },
                    zIndex: theme.zIndex.drawer + 1,
                  }}
                >
                  <List component="div" disablePadding>
                    <ListItem disablePadding>
                      <SubmenuLink to="/producto-categoria/cirugia">
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#57B046' }}>
                          <SurgeryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Cirugía" />
                      </SubmenuLink>
                    </ListItem>
                    <ListItem disablePadding>
                      <SubmenuLink to="/producto-categoria/diagnostico">
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#57B046' }}>
                          <DiagnosticIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Diagnóstico" />
                      </SubmenuLink>
                    </ListItem>
                    <ListItem disablePadding>
                      <SubmenuLink to="/producto-categoria/monitoreo">
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#57B046' }}>
                          <MonitoringIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Monitoreo" />
                      </SubmenuLink>
                    </ListItem>
                  </List>
                </Collapse>
              </ListItem>
              
              {/* Servicios */}
              <ListItem 
                disablePadding
                onMouseEnter={!isMobile ? () => handleSubmenuToggle('servicios') : undefined}
                onMouseLeave={!isMobile ? () => handleSubmenuToggle('servicios') : undefined}
                sx={{ position: 'relative' }}
              >
                <NavLink 
                  to="#" 
                  onClick={isMobile ? () => handleSubmenuToggle('servicios') : undefined}
                >
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <ServicesIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Servicios" />
                  {openSubmenu.servicios ? <ExpandLess /> : <ExpandMore />}
                </NavLink>
                
                <Collapse 
                  in={openSubmenu.servicios} 
                  timeout="auto" 
                  unmountOnExit
                  sx={{
                    position: { xs: 'static', md: 'absolute' },
                    top: '100%',
                    left: 0,
                    width: { xs: '100%', md: '220px' },
                    backgroundColor: '#FFFFFF',
                    borderRadius: { xs: 0, md: '0 0 8px 8px' },
                    boxShadow: { xs: 'none', md: '0 5px 15px rgba(0, 0, 0, 0.1)' },
                    zIndex: theme.zIndex.drawer + 1,
                  }}
                >
                  <List component="div" disablePadding>
                    <ListItem disablePadding>
                      <SubmenuLink to="/alquiler-de-equipamientos">
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#57B046' }}>
                          <RentalIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Alquiler de Equipamiento" />
                      </SubmenuLink>
                    </ListItem>
                    <ListItem disablePadding>
                      <SubmenuLink to="/servicio-tecnico">
                        <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#57B046' }}>
                          <SupportIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Servicio Técnico" />
                      </SubmenuLink>
                    </ListItem>
                  </List>
                </Collapse>
              </ListItem>
              
              {/* Representaciones */}
              <ListItem disablePadding>
                <NavLink to="/representaciones">
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <RepresentationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Representaciones" />
                </NavLink>
              </ListItem>
              
              {/* Contacto */}
              <ListItem disablePadding>
                <NavLink to="/contacto">
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                    <ContactIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Contacto" />
                </NavLink>
              </ListItem>
              
              {/* Comparativa de productos (Highlight) */}
              <ListItem 
              disablePadding 
              sx={{ 
                ml: { xs: 0, md: 'auto' },
                mt: { xs: 1, md: 0 },
                order: { xs: 1, md: 'initial' },
              }}
            >
              <HighlightButton 
                component={Link}
                to="/calculadora"
                sx={{
                  padding: (theme) => theme.spacing(1.5, 2),
                  borderBottom: '3px solid transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1, color: '#003daf' }}>
                  <CalculatorIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Calculadora" />
              </HighlightButton>
            </ListItem>
            </List>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};