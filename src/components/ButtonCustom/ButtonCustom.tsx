import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface ButtonCustomProps extends ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'contained' | 'outlined';
  color: 'primary' | 'secondary';
  disabled?: boolean;
}

export const ButtonCustom: React.FC<ButtonCustomProps> = ({
  children,
  onClick,
  variant,
  color,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      color={color}
      disabled={disabled}
      sx={{
        borderRadius: '30px',
        textTransform: 'none',
        fontWeight: 600,
        padding: '10px 20px',
        boxShadow: variant === 'contained' ? '0px 8px 15px rgba(0, 0, 0, 0.1)' : 'none',
        '&:hover': {
          boxShadow: variant === 'contained' ? '0px 12px 25px rgba(0, 0, 0, 0.1)' : 'none',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};


