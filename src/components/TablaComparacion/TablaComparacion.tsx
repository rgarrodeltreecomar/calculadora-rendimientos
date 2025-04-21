import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    styled,
    tableCellClasses,
    Box,
    useTheme,
} from "@mui/material";
import { ReactNode } from "react";

export const TableCellStyled = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main, 
        color: theme.palette.primary.contrastText, 
        fontWeight: 700,
        fontSize: "0.875rem",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        borderBottom: `2px solid ${theme.palette.divider}`,
        '&:first-of-type': {
            borderTopLeftRadius: theme.shape.borderRadius,
        },
        '&:last-of-type': {
            borderTopRightRadius: theme.shape.borderRadius,
        },
    },
    [`&.${tableCellClasses.body}`]: {
        backgroundColor: "#ffffff",
        fontSize: "0.875rem",
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1.5),
    },
    '&.highlight-positive': {
        color: theme.palette.success.main,
        backgroundColor: theme.palette.success.light,
    },
    '&.highlight-negative': {
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.light,
    },
}));

export const StyledRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even) td": {
        backgroundColor: "#ffffff", 
    },
    "&:hover td": {
        backgroundColor: theme.palette.action.hover,
    },
    "&.active-row td": {
        backgroundColor: theme.palette.primary.contrastText,
        fontWeight: 500,
    },
    "&.best-performance td": {
        borderLeft: `4px solid ${theme.palette.success.main}`,
    },
}));

export interface DataTableProps {
    isLoading?: boolean;
    columns: {
        text: string; 
        align?: "left" | "center" | "right";
        width?: string | number;
    }[];
    children?: ReactNode;
    emptyState?: ReactNode;
    maxHeight?: number | string;
    minHeight?: number | string;
    stickyHeader?: boolean;
}

export const DataTable = ({ 
    isLoading = false, 
    columns, 
    children, 
    emptyState,
    maxHeight = 540,
    minHeight,
    stickyHeader = true
}: DataTableProps) => {
    const theme = useTheme();

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                borderRadius: 3,
                maxHeight,
                minHeight,
                boxShadow: theme.shadows[1],
                '&:hover': {
                    boxShadow: theme.shadows[3],
                },
                transition: theme.transitions.create('box-shadow'),
                backgroundColor: "#ffffff", 
            }}
        >
            {isLoading ? (
                <Box sx={{ p: 2 }}>
                    <Skeleton variant="rounded" height={56} sx={{ mb: 1 }} />
                    {[1, 2, 3, 4].map((item) => (
                        <Skeleton 
                            key={item} 
                            variant="rounded" 
                            height={52} 
                            sx={{ mb: item === 4 ? 0 : 1 }} 
                        />
                    ))}
                </Box>
            ) : (
                <Table stickyHeader={stickyHeader} sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map(({ text, align, width }) => (
                                <TableCellStyled 
                                    key={text} 
                                    align={align || "left"}
                                    sx={{ width }}
                                >
                                    {text}
                                </TableCellStyled>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {children || (
                            <TableRow>
                                <TableCellStyled colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    {emptyState || 'No hay datos disponibles'}
                                </TableCellStyled>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </TableContainer>
    );
};