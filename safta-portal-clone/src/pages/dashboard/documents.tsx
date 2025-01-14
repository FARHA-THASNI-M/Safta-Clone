import React, { useState, useEffect } from "react";
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
  Chip,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { KeyboardArrowLeft, KeyboardArrowRight, Edit, Delete } from "@mui/icons-material";
import axiosInstance from "../../api/axios";
import { format } from "date-fns";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface RowData {
  id: number;
  title: string;
  workgroup_name: string;
  deliverable_name: number;
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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
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

  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>,
    pageNumber: number
  ) => {
    onPageChange(null, pageNumber);
  };

  return (
    <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "4px", ml: 2.5 }}>
      <IconButton
        size="small"
        onClick={handleBackButtonClick}
        disabled={page === 0}
        sx={{ color: "#666" }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
        <Box
          key={pageNum}
          onClick={(event) => handlePageClick(event, pageNum)}
          sx={{
            cursor: "pointer",
            width: "32px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: pageNum === page ? "#000" : "transparent",
            color: pageNum === page ? "#fff" : "#666",
            fontSize: "0.875rem",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: pageNum === page ? "#000" : "#f5f5f5",
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
        sx={{ color: "#666" }}
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState({
    date: "",
    workgroup: "",
    status: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage, filters]);  // Added filters to the dependency array

  const fetchDocuments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>(
        `/documents?lang=en&page=${page + 1}&size=${rowsPerPage}`
      );
      const data = response.data.data;
      setRows(data.documents);
      setTotalResults(data.pagination.totalCount);
      setError(null);
    } catch (err) {
      setError("Failed to fetch documents. Please try again later.");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      setDeleting(id);
      await axiosInstance.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err) {
      setError("Failed to delete document");
      console.error("Error deleting document:", err);
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

  const handleFilterChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      date: "",
      workgroup: "",
      status: "",
    });
  };

  const filteredRows = rows.filter(
    (row) =>
      (filters.date ? format(new Date(row.created_at), "yyyy-MM-dd") === filters.date : true) &&
      (row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.workgroup_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Date"
            type="date"
            name="date"
            InputLabelProps={{ shrink: true }}
            value={filters.date}
            onChange={handleFilterChange}
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          />
          <Select
            name="workgroup"
            value={filters.workgroup}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          >
            <MenuItem value="">Workgroup</MenuItem>
          </Select>
          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            displayEmpty
            sx={{
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          >
            <MenuItem value="">Status</MenuItem>
          </Select>
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: "300px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "black", 
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
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset
          </Button>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1600px",
          margin: "auto",
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 750,
            "& .MuiTableCell-root": {
              padding: "12px 16px",
            },
          }}
          aria-label="documents table"
        >
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.workgroup_name}</TableCell>
                <TableCell>{row.deliverable_name || " - "}</TableCell>
                <TableCell>{format(new Date(row.created_at), "dd MMM yyyy")}</TableCell>
                <TableCell>{row.creator_name}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status === 2 ? "Approved" : row.status === 1 ? "Pending" : "Rejected"}
                    size="small"
                    sx={{
                      color: row.status === 2 ? "green" : row.status === 1 ? "#ff5e00" : "#bf1000",
                      backgroundColor: row.status === 2 ? "#ccffc9" : row.status === 1 ? "#ffe0a6" : "#fca69f",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {row.public_at === null ? (
                    <CheckCircleOutlineIcon sx={{ color: "green" }} />
                  ) : (
                    <CancelOutlinedIcon sx={{ color: "red" }} />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row.id)}
                    disabled={deleting === row.id}
                  >
                    {deleting === row.id ? (
                      <CircularProgress size={24} />
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
                  borderBottom: "none",
                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: 0,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "#666",
                    marginLeft: "8px",
                    justifyContent: "flex-start",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    display: "none",
                  },
                  "& .MuiTablePagination-select": {
                    marginLeft: 0,
                    marginRight: "8px",
                  },
                  "& .MuiTablePagination-actions": {
                    marginLeft: "auto",
                  },
                  "& .MuiSelect-select": {
                    paddingTop: "4px",
                    paddingBottom: "4px",
                  },
                  "& .MuiInputBase-root": {
                    marginRight: "8px",
                    marginLeft: 0,
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
