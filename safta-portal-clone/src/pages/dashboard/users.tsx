import React, { useState, useEffect } from 'react';
import {Box,Table,TableBody,TableCell,TableContainer,TableRow,TableHead,TableFooter,TablePagination,Paper,InputAdornment,IconButton,Chip,CircularProgress,TextField,MenuItem,Button,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { KeyboardArrowLeft, KeyboardArrowRight, Edit, Delete, Add } from '@mui/icons-material';
import axiosInstance from '../../api/axios';

interface RowData {
  id: number;
  first_name: string;
  member_name: string;
  email: string;
  phone_number: string;
  total_workgroups: string;
  status: number;
  invite_accepted_at: string | null;
}
interface Pagination {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}
interface PaginatedResponse {
  data: {
    memberUsers: RowData[];
    pagination: Pagination;
  };
}

interface Filters {
  member: string;
  workgroup: string;
  status: string;
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

const Users: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rows, setRows] = useState<RowData[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    member: '',
    workgroup: '',
    status: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filters]);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>(
        `https://dev-portal.safta.sa/api/v1/member-users?lang=en&page=${page + 1}&size=${rowsPerPage}`
      );
      const data = response.data.data;
      setRows(data.memberUsers);
      setTotalResults(data.pagination.totalCount);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
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
      member: '',
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

  const filteredRows = rows.filter(
    (row) =>
      (row.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filters.member ? row.member_name === filters.member : true) &&
      (filters.status ? row.status === parseInt(filters.status) : true)
  );

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
            value={filters.member}
            onChange={handleFilterChange}
            name="member"
            defaultValue=""
            sx={{ width: '150px' }}
          >
            <MenuItem value="">Members</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            value={filters.status}
            onChange={handleFilterChange}
            name="status"
            defaultValue=""
            sx={{ width: '150px' }}
          >
            <MenuItem value="">Invitation Status</MenuItem>
            <MenuItem value="1">Accepted</MenuItem>
            <MenuItem value="2">invited</MenuItem>
            <MenuItem value="3">Rejected</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            sx={{ backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #e0e0e0', textTransform: 'none' }}
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
              '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'black' } },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: 'none', backgroundColor:"black" ,color:"white" }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Working Groups</TableCell>
              <TableCell>Invitation Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.first_name}</TableCell>
                <TableCell>{row.member_name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone_number}</TableCell>
                <TableCell>{row.total_workgroups}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      row.status === 1
                        ? 'Accepted'
                        : row.status === 2
                        ? 'invited'
                        : 'Rejected'
                    }
                    size="small"
                    sx={{
                      color: row.status === 1 ? 'green' : row.status === 2 ? '#ff5e00' : '#bf1000',
                      backgroundColor:
                        row.status === 1
                          ? '#ccffc9'
                          : row.status === 2
                          ? '#ffe0a6'
                          : '#fca69f',
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
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
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
