import React from 'react';
import Pagination from '@mui/material/Pagination';

interface TablePaginationProps {
  pagesCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({ pagesCount, currentPage, onPageChange }) => (
  <Pagination shape="rounded" count={pagesCount} page={currentPage} onChange={(_, page) => onPageChange(page)} />
);

export default TablePagination;
