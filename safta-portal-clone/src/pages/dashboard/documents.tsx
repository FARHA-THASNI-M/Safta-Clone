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
  TextField,
  Chip,
  Button,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Edit, Delete } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { format } from "date-fns";
import axiosInstance from "../../api/axios";
import TablePaginationActions from "../../components/Pagination";
import Editor from "../../components/Editor";
import { useGetDocumentsQuery } from "../../services/documents/documentService";
import { useSearchParams } from "react-router-dom";
import { useGetWorkgroupsQuery } from "../../services/working groups/workinggroupService";
interface RowData {
  id: number;
  workgroup_id: number;
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

interface Workgroup {
  id: string;
  name: string;
}

interface Filters {
  date: string;
  workgroupId: string;
  status: string;
}

const Documents: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    date: "",
    workgroupId: "",
    status: "",
  });
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<RowData | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: workgroupData,
    error: workgroupError,
    isLoading: isWorkgroupsLoading,
  } = useGetWorkgroupsQuery();

  useEffect(() => {
    if (workgroupError) {
      setError("Failed to fetch workgroups.");
      console.error("Error fetching workgroups:", workgroupError);
    }
  }, [workgroupError]);
  const [workgroups, setWorkgroups] = useState<Workgroup[]>([]);
  useEffect(() => {
    if (workgroupData) {
      setWorkgroups(workgroupData.data.workgroups);
    }
  }, [workgroupData]);

  useEffect(() => {
    const filterObj: Filters = {
      date: searchParams.get("uploaded_at") || "",
      workgroupId: searchParams.get("working_group") || "",
      status: searchParams.get("status") || "",
    };
    setFilters(filterObj);
  }, [searchParams]);

  useEffect(() => {}, [page, rowsPerPage, filters, searchQuery, isEditorOpen]);
  const { data: GetDocuments, isLoading } = useGetDocumentsQuery({
    page: page,
    size: rowsPerPage,
    workgroup: filters.workgroupId || undefined,
    status: filters.status || undefined,
    uploaded_at: filters.date || undefined,
  });

  const handleDelete = async (
    id: number,
    workgroup_id: number
  ): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      setDeleting(id);
      await axiosInstance.delete(
        `/workgroups/${workgroup_id}/documents/${id}?lang=en`
      );
    } catch (err) {
      setError("Failed to delete document");
      console.error("Error deleting document:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (document: RowData) => {
    setSelectedDocument(document);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setSelectedDocument(null);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      const updatedSearchParams = new URLSearchParams();

      if (newFilters.workgroupId)
        updatedSearchParams.set("working_group", newFilters.workgroupId);
      if (newFilters.status)
        updatedSearchParams.set("status", newFilters.status);
      if (newFilters.date)
        updatedSearchParams.set("uploaded_at", newFilters.date);
      setSearchParams(updatedSearchParams);
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      date: "",
      workgroupId: "",
      status: "",
    });
    setSearchParams({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton sx={{ color: "black", padding: "7px" }}>
          <TuneIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextField
            type="date"
            size="small"
            value={filters.date}
            onChange={handleFilterChange}
            name="date"
            sx={{
              width: "150px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          />
          <TextField
            select
            size="small"
            value={filters.workgroupId}
            onChange={handleFilterChange}
            name="workgroupId"
            defaultValue=""
            label="Working Groups"
            sx={{
              width: "150px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          >
            {workgroups.map((workgroup) => (
              <MenuItem key={workgroup.id} value={workgroup.id}>
                {workgroup.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={filters.status}
            onChange={handleFilterChange}
            name="status"
            defaultValue=""
            label="Status"
            sx={{
              width: "150px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black",
              },
            }}
          >
            <MenuItem value="1">Pending</MenuItem>
            <MenuItem value="2">Approved</MenuItem>
            <MenuItem value="3">Rejected</MenuItem>
          </TextField>
          <Button
            variant="outlined"
            onClick={handleResetFilters}
            sx={{
              backgroundColor: "lightgrey",
              color: "darkgray",
              border: "1px solid #e0e0e0",
              minWidth: "80px",
            }}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchQuery}
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
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}
      >
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
            {GetDocuments?.data?.documents.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.workgroup_name}</TableCell>
                <TableCell>{row.deliverable_name || "-"}</TableCell>
                <TableCell>
                  {format(new Date(row.created_at), "dd MMM yyyy")}
                </TableCell>
                <TableCell>{row.creator_name}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      row.status === "2"
                        ? "Approved"
                        : row.status === "1"
                        ? "Pending"
                        : "Rejected"
                    }
                    size="small"
                    sx={{
                      color:
                        row.status === "2"
                          ? "green"
                          : row.status === "1"
                          ? "#ff5e00"
                          : "#bf1000",
                      backgroundColor:
                        row.status === "2"
                          ? "#ccffc9"
                          : row.status === "1"
                          ? "#ffe0a6"
                          : "#fca69f",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {row.public_at === null ? (
                    <CancelOutlinedIcon sx={{ color: "red" }} />
                  ) : (
                    <CheckCircleOutlineIcon sx={{ color: "green" }} />
                  )}
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
              {/* <TablePagination
                colSpan={9}
                count={data?.data?.pagination?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                rowsPerPageOptions={[10, 20, 30]}
                labelRowsPerPage=""
                labelDisplayedRows={({ count }) => `${count} results`}
              /> */}
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* 
      <Editor
        open={isEditorOpen}
        onClose={handleEditorClose}
        selectedDocument={selectedDocument}
      /> */}
    </Box>
  );
};

export default Documents;
