import { Box, Typography, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface StarProductCellProps {
  name: string;
  isStar: boolean;
}

export const StarProductCell = ({ name, isStar }: StarProductCellProps) => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={1.5} width="100%">
      <Typography 
        variant="body1" 
        fontWeight={500}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1
        }}
      >
        {name}
      </Typography>
      {isStar && (
        <Badge
          badgeContent="RECOMENDADO"
          color="warning"
          sx={{
            flexShrink: 0,
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.warning.dark,
              color: theme.palette.getContrastText(theme.palette.warning.dark),
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: theme.spacing(0.5),
              height: 20,
              minWidth: 26,
              borderRadius: 4,
              letterSpacing: '1px',
              position: 'relative',
              transform: 'none',
              right: 'auto',
              top: 'auto',
              marginLeft: theme.spacing(1),
            },
          }}
        />
      )}
    </Box>
  );
};