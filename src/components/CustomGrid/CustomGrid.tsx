import React from 'react';
import { styled } from '@mui/system';
import type { CSSProperties, ReactNode } from 'react';

export type CustomGridProps = {
  children?: ReactNode;
  container?: boolean;
  item?: boolean;
  spacing?: number;
  rowSpacing?: number;
  columnSpacing?: number;
  xs?: number | boolean | 'auto';
  sm?: number | boolean | 'auto';
  md?: number | boolean | 'auto';
  lg?: number | boolean | 'auto';
  xl?: number | boolean | 'auto';
  sx?: CSSProperties;
  style?: CSSProperties;
  className?: string;
  zeroMinWidth?: boolean;
};

const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const computeFlex = (value?: number | boolean | 'auto') => {
  if (value === 'auto') return '0 0 auto';
  if (value === true) return '1 1 0%';
  if (!value || value <= 0) return '0 0 0%';
  
  const percentage = (value / 12) * 100;
  return `0 0 ${percentage}%`;
};

const computeMaxWidth = (value?: number | boolean | 'auto') => {
  if (value === 'auto' || value === true) return 'none';
  if (!value || value <= 0) return '0%';
  
  const percentage = (value / 12) * 100;
  return `${percentage}%`;
};

const GridItem = styled('div')<CustomGridProps>(({ 
  item, 
  xs, 
  sm, 
  md, 
  lg, 
  xl, 
  zeroMinWidth 
}) => ({
  ...(item && {
    boxSizing: 'border-box',
    flex: computeFlex(xs),
    maxWidth: computeMaxWidth(xs),
    ...(zeroMinWidth && { minWidth: 0 }),
    [`@media (min-width:${BREAKPOINTS.sm}px)`]: sm !== undefined && { 
      flex: computeFlex(sm),
      maxWidth: computeMaxWidth(sm),
    },
    [`@media (min-width:${BREAKPOINTS.md}px)`]: md !== undefined && { 
      flex: computeFlex(md),
      maxWidth: computeMaxWidth(md),
    },
    [`@media (min-width:${BREAKPOINTS.lg}px)`]: lg !== undefined && { 
      flex: computeFlex(lg),
      maxWidth: computeMaxWidth(lg),
    },
    [`@media (min-width:${BREAKPOINTS.xl}px)`]: xl !== undefined && { 
      flex: computeFlex(xl),
      maxWidth: computeMaxWidth(xl),
    },
  }),
}));

const GridContainer = styled('div')<CustomGridProps>(({ 
  spacing = 0, 
  rowSpacing, 
  columnSpacing 
}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  margin: `calc(-${(rowSpacing ?? spacing) / 2}px)`,
  '& > *': {
    boxSizing: 'border-box',
    padding: `calc(${(columnSpacing ?? spacing) / 2}px)`,
  },
}));

export const CustomGrid: React.FC<CustomGridProps> = (props) => {
  const { 
    container = false, 
    item = false, 
    children, 
    style, 
    sx, 
    className,
    ...rest 
  } = props;

  if (container) {
    return (
      <GridContainer 
        {...rest} 
        style={{ ...style, ...sx }}
        className={className}
      >
        {children}
      </GridContainer>
    );
  }

  if (item) {
    return (
      <GridItem 
        {...rest} 
        style={{ ...style, ...sx }}
        className={className}
      >
        {children}
      </GridItem>
    );
  }

  return (
    <div 
      style={{ ...style, ...sx }} 
      className={className}
    >
      {children}
    </div>
  );
};

