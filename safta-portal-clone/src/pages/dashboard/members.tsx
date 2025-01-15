import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableFooter,
  TablePagination,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { KeyboardArrowLeft, KeyboardArrowRight, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../../api/axios';

interface RowData {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  sector: number;
  joined_at: string;
  total_users: number;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

interface PaginatedResponse {
  data: {
    members: RowData[];
    pagination: Pagination;
  };
}

interface Filters {
  sector: string;
  joinedFrom: string;
  joinedTo: string;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

const TablePaginationActions: React.FC<TablePaginationActionsProps> = (props) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    onPageChange(null, pageNumber);
  };

  return (
    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', ml: 2.5 }}>
      <IconButton
        size="small"
        onClick={handleBackButtonClick}
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
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        sx={{ color: '#666' }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

const Members: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<RowData[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    sector: '',
    joinedFrom: '',
    joinedTo: '',
  });

  useEffect(() => {
    fetchMembers();
  }, [page, rowsPerPage, filters]);

  const fetchMembers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>(
        `/members?lang=en&page=${page + 1}&size=${rowsPerPage}`
      );
      const data = response.data.data;
      setRows(data.members);
      setTotalResults(data.pagination.totalCount);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members. Please try again later.');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return;
    }
    try {
      setDeleting(id);
      await axiosInstance.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      setError('Failed to delete member');
      console.error('Error deleting member:', err);
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
      sector: '',
      joinedFrom: '',
      joinedTo: '',
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

  const filteredRows = rows.filter(
    (row) =>
      (row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filters.sector ? row.sector.toString() === filters.sector : true)
  );

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton sx={{ color: 'black', padding: '7px' }}>
          <TuneIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            select
            size="small"
            value={filters.sector}
            onChange={handleFilterChange}
            name="sector"
            defaultValue=""
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          >
            <MenuItem value="">Sector</MenuItem>
            <MenuItem value="1">Public Sector</MenuItem>
            <MenuItem value="2">Private Sector</MenuItem>
            <MenuItem value="3">Research & Academia</MenuItem>
          </TextField>

          <TextField
            type="date"
            size="small"
            value={filters.joinedFrom}
            onChange={handleFilterChange}
            name="joinedFrom"
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          />

          <TextField
            type="date"
            size="small"
            value={filters.joinedTo}
            onChange={handleFilterChange}
            name="joinedTo"
            sx={{
              width: '150px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'black',
              },
            }}
          />
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

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Users</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email || '-'}</TableCell>
                <TableCell>{row.phone_number || '-'}</TableCell>
                <TableCell>
                  {row.sector === 1
                    ? 'Public Sector'
                    : row.sector === 2
                    ? 'Private Sector'
                    : 'Research & Academia'}
                </TableCell>
                <TableCell>{formatDate(row.joined_at)}</TableCell>
                <TableCell>{row.total_users}</TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(row.id)}
                    disabled={deleting === row.id}
                  >
                    {deleting === row.id ? <CircularProgress size={20} /> : <Delete />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={8}
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

export default Members;
