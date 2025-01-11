import React, { useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Chip,
  TextField,
  Button,
  TablePagination,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// Row Data
interface RowData {
  id: number;
  documentTitle: string;
  workingGroup: string;
  uploadedDate: string;
  uploadedBy: string;
  status: string;
  isPublic: boolean;
}

// Sample Data
const rows: RowData[] = [
  {
    id: 1,
    documentTitle: "Document A",
    workingGroup: "Group 1",
    uploadedDate: "2024-12-15",
    uploadedBy: "User 1",
    status: "Approved",
    isPublic: false,
  },
  {
    id: 2,
    documentTitle: "Document B",
    workingGroup: "Group 2",
    uploadedDate: "2024-12-16",
    uploadedBy: "User 2",
    status: "Pending",
    isPublic: true,
  },
  {
    id: 3,
    documentTitle: "Document C",
    workingGroup: "Group 1",
    uploadedDate: "2024-12-18",
    uploadedBy: "User 3",
    status: "Rejected",
    isPublic: false,
  },
];

export default function FilterableTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [filters, setFilters] = useState({
    workingGroup: "",
    status: "",
    date: "",
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  // Change page handler
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null, 
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Change rows per page handler
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter change handler for Select fields
  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;

    // Update filter state
    const newFilters = { ...filters, [name!]: value };
    setFilters(newFilters);

    // Filter data based on the updated filter values
    const filtered = rows.filter((row) => {
      const matchesWorkingGroup = newFilters.workingGroup === "" || row.workingGroup === newFilters.workingGroup;
      const matchesStatus = newFilters.status === "" || row.status === newFilters.status;
      const matchesDate = newFilters.date === "" || row.uploadedDate === newFilters.date;

      return matchesWorkingGroup && matchesStatus && matchesDate;
    });

    // Update filtered rows and reset to first page
    setFilteredRows(filtered);
    setPage(0);
  };

  // Reset filters handler
  const handleResetFilters = () => {
    setFilters({
      workingGroup: "",
      status: "",
      date: "",
    });
    setFilteredRows(rows);
    setPage(0);
  };

  return (
    <Box>
      {/* Filters */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Date"
          type="date"
          name="date"
          InputLabelProps={{ shrink: true }}
          value={filters.date}
          onChange={(e) => handleFilterChange({ target: { name: 'date', value: e.target.value } } as SelectChangeEvent<string>)} // Adjusted to match SelectChangeEvent
        />
        <Select
          name="workingGroup"
          value={filters.workingGroup}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">All Working Groups</MenuItem>
          <MenuItem value="Group 1">Group 1</MenuItem>
          <MenuItem value="Group 2">Group 2</MenuItem>
        </Select>
        <Select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
        <Button variant="outlined" onClick={handleResetFilters}>
          Reset
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell>S. No</TableCell>
              <TableCell>Document Title</TableCell>
              <TableCell>Working Group</TableCell>
              <TableCell>Uploaded Date</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Public</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRows
            ).map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.documentTitle}</TableCell>
                <TableCell>{row.workingGroup}</TableCell>
                <TableCell>{row.uploadedDate}</TableCell>
                <TableCell>{row.uploadedBy}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={
                      row.status === "Approved"
                        ? "success"
                        : row.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.isPublic ? "Yes" : "No"}</TableCell>
                <TableCell align="center">
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={8}
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Custom Pagination Actions
function TablePaginationActions(props: any) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}
