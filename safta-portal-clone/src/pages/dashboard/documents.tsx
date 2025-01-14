import React, { useState, useEffect } from "react";
import {Box,Table,TableBody,TableCell,TableContainer,TableRow,TableHead,Paper,IconButton,Chip,Button,CircularProgress,Alert,Select,MenuItem,FormControl,InputLabel,} from "@mui/material";
import {KeyboardArrowLeft,KeyboardArrowRight,KeyboardArrowDown,Edit,Delete,} from "@mui/icons-material";
import axiosInstance from "../../api/axios";
import { format } from "date-fns";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

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

export default function Documents() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<RowData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [page, rowsPerPage]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<PaginatedResponse>(
        `/documents?lang=en&page=${page}&size=${rowsPerPage}`
      );
      const data = response.data.data;
      setRows(data.documents);
      setTotalResults(data.pagination.totalCount);
      setTotalPages(data.pagination.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch documents. Please try again later.");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/documents/${id}`);
      fetchDocuments(); 
    } catch (err) {
      setError("Failed to delete document");
      console.error("Error deleting document:", err);
    }
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(event.target.value as number);
    setPage(1); 
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>);}
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>);}

  return (
    <Box>
      <TableContainer
  component={Paper}
  sx={{
    maxWidth: "1200px",
    margin: "auto", 
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
    borderRadius: "8px", 
    overflow: "hidden",
  }}>
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
      <TableRow
        sx={{
          backgroundColor: "#f5f5f5",
        }}
      >
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
      {rows.map((row, index) => (
        <TableRow
          key={row.id}
          sx={{
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <TableCell>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
          <TableCell>{row.title}</TableCell>
          <TableCell>{row.workgroup_name}</TableCell>
          <TableCell>{row.deliverable_name || " - "}</TableCell>
          <TableCell>{format(new Date(row.created_at), "dd MMM yyyy")}</TableCell>
          <TableCell>{row.creator_name}</TableCell>
          <TableCell>
            <Chip
              label={row.status === 1 ? "Approved": row.status === 2 ? "Pending": "Rejected" }
              size="small"
              sx={{color:row.status === 1 ? "green": row.status === 2 ? "#ff5e00": "#bf1000",
                   backgroundColor:row.status === 1 ? "#ccffc9": row.status === 2 ? "#ffe0a6": "#fca69f",}}/>
          </TableCell>
          <TableCell>
            {row.public_at === null ? (
              <CheckCircleOutlineIcon sx={{ color: "green" }} /> ) : (<CancelOutlinedIcon sx={{ color: "red" }} />)}
          </TableCell>
          <TableCell align="center">
            <IconButton>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(row.id)}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        mt={2}
        borderTop="1px solid #e0e0e0"
        bgcolor="#f9f9f9"
         >
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl size="small" variant="standard" sx={{ minWidth: 80 }}>
            <InputLabel>Rows</InputLabel>
            <Select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              label="Rows"
              IconComponent={(props) => (
                <KeyboardArrowDown {...props} style={{ color: "black" }} />
              )}
              disableUnderline
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>
          <Box>{totalResults} results</Box>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <KeyboardArrowLeft />
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              sx={{
                mx: 0.5,
                backgroundColor: pageNum === page ? "black" : "transparent",
                color: pageNum === page ? "white" : "black",
                border: "1px solid black",
                "&:hover": {
                  backgroundColor: pageNum === page ? "black" : "#f0f0f0",
                },
              }}
            >
              {pageNum}
            </Button>
          ))}
          <IconButton
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
