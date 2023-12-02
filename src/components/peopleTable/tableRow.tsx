import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


const TableRowComponent = ({ data }: { name: any; gender?: string; height?: string; eye_color?: string; }) => (
  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell component="th" scope="row">
      {data.name}
    </TableCell>
    <TableCell>{data.gender}</TableCell>
    <TableCell>{data.height}</TableCell>
    <TableCell>{data.eye_color}</TableCell>
    <TableCell></TableCell>
  </TableRow>
);

export default TableRowComponent;
