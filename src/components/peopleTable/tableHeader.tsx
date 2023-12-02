import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface TableHeaderProps {
  columns: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => (
  <TableRow>
    {columns.map((header) => (
      <TableCell key={`id${header}`}>{header}</TableCell>
    ))}
  </TableRow>
);

export default TableHeader;
