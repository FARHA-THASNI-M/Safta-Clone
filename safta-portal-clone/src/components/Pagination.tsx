import React from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

const TablePaginationActions: React.FC<TablePaginationActionsProps> = ({ count, page, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleArrowButtonClick = (direction: 'back' | 'next') => {
    const newPage = direction === 'back' ? page - 1 : page + 1;
    onPageChange(null, newPage);
  };
  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    onPageChange(null, pageNumber);
  };

  return (
    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', ml: 2.5 }}>
      <IconButton
        size="small"
        onClick={() => handleArrowButtonClick('back')}
        disabled={page === 0}
        sx={{ color: '#666' }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
        <Box
          key={pageNum}
          onClick={(event) => handlePageClick(event, pageNum)}
          sx={{
            cursor: 'pointer',
            width: '32px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pageNum === page ? '#000' : 'transparent',
            color: pageNum === page ? '#fff' : '#666',
            fontSize: '0.875rem',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: pageNum === page ? '#000' : '#f5f5f5',
            },
          }}
        >
          {pageNum + 1}
        </Box>
      ))}
      <IconButton
        size="small"
        onClick={() => handleArrowButtonClick('next')}
        disabled={page >= totalPages - 1}
        sx={{ color: '#666' }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default TablePaginationActions;
