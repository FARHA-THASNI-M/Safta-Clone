import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, TableFooter, TablePagination, Paper, InputAdornment, IconButton, TextField, CircularProgress, Chip, Button, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { KeyboardArrowLeft, KeyboardArrowRight, Edit, Delete } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { format } from 'date-fns';
import axiosInstance from '../../api/axios'; 

interface RowData {
  id: number;
  title: string;
  workgroup_name: string;
  deliverable_name: string | null;
  created_at: string;
  creator_name: string;
  status: number;
  public_at: string | null;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface PaginatedResponse {
  data: {
    documents: RowData[];
    pagination: Pagination;
  };
}

interface Filters {
  date: string;
  workgroup: string;
  status: string;
}

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

const Documents: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<RowData[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    date: '',
    workgroup: '',
    status: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage, filters, searchQuery]);  

  const fetchDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>(
        `/documents?lang=en&page=${page + 1}&size=${rowsPerPage}&q=${searchQuery}`
      );
      const data = response.data.data;
      setRows(data.documents);
      setTotalResults(data.pagination.totalCount);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents. Please try again later.');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    try {
      setDeleting(id);
      await axiosInstance.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
      console.error('Error deleting document:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      date: '',
      workgroup: '',
      status: '',
    });
    setSearchQuery('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Box className="error-message">{error}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Filters and Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton sx={{ color: 'black', padding: '7px' }}>
          <TuneIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type="date"
            size="small"
            value={filters.date}
            onChange={handleFilterChange}
            name="date"
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          />
          <TextField
            select
            size="small"
            value={filters.workgroup}
            onChange={handleFilterChange}
            name="workgroup"
            defaultValue=""
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          >
            <MenuItem value="">Working Groups</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            value={filters.status}
            onChange={handleFilterChange}
            name="status"
            defaultValue=""
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          >
            <MenuItem value="">Status</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              backgroundColor: '#f5f5f5',
              color: '#666',
              border: '1px solid #e0e0e0',
              '&:hover': {
                backgroundColor: '#eeeeee',
                border: '1px solid #e0e0e0',
              },
              textTransform: 'none',
              minWidth: '80px',
            }}
          >
            Reset
          </Button>
        </Box>

        {/* Search Box */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'black',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Document Title</TableCell>
              <TableCell>Working Group</TableCell>
              <TableCell>Deliverable</TableCell>
              <TableCell>Uploaded Date</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Public</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.workgroup_name}</TableCell>
                <TableCell>{row.deliverable_name || '-'}</TableCell>
                <TableCell>{format(new Date(row.created_at), 'dd MMM yyyy')}</TableCell>
                <TableCell>{row.creator_name}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status === 2 ? 'Approved' : row.status === 1 ? 'Pending' : 'Rejected'}
                    size="small"
                    sx={{
                      color: row.status === 2 ? 'green' : row.status === 1 ? '#ff5e00' : '#bf1000',
                      backgroundColor: row.status === 2 ? '#ccffc9' : row.status === 1 ? '#ffe0a6' : '#fca69f',
                    }}
                  />
                </TableCell>
                <TableCell>
                  {row.public_at === null ? (
                    <CancelOutlinedIcon sx={{ color: 'red' }} />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ color: 'green' }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row.id)}
                    disabled={deleting === row.id}
                  >
                    {deleting === row.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Delete />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={9}
                count={totalResults}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[10, 20, 30]}
                labelRowsPerPage=""
                labelDisplayedRows={({ count }) => `${count} results`}
                sx={{
                  borderBottom: 'none',
                  '& .MuiTablePagination-toolbar': {
                    paddingLeft: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                  '& .MuiTablePagination-displayedRows': {
                    color: '#666',
                    marginLeft: '8px',
                  },
                  '& .MuiTablePagination-selectLabel': {
                    display: 'none',
                  },
                  '& .MuiSelect-select': {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Documents;
