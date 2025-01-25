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
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { Edit, Delete } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { format } from "date-fns";
import TablePaginationActions from "../../components/Pagination";
import Editor from "../../components/Editor";
import {
  useGetDocumentsQuery,
  useDeleteDocumentMutation,
} from "../../services/documents/documentService";
import { useSearchParams } from "react-router-dom";
import { useGetWorkgroupsQuery } from "../../services/working groups/workinggroupService";
import { DocumentParams } from "../../services/documents/types";

const Documents: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [filters, setFilters] = useState<DocumentParams>({
    uploaded_at: "",
    workgroup: "",
    status: "",
  });
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
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
  const [workgroups, setWorkgroups] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    if (workgroupData) {
      setWorkgroups(workgroupData.data.workgroups);
    }
  }, [workgroupData]);

  useEffect(() => {
    const filterObj: DocumentParams = {
      uploaded_at: searchParams.get("uploaded_at") || "",
      workgroup: searchParams.get("working_group") || "",
      status: searchParams.get("status") || "",
    };
    setFilters(filterObj);
  }, [searchParams]);

  const { data: GetDocuments, refetch } = useGetDocumentsQuery({
    ...filters,
    page: page,
    size: rowsPerPage,
  });

  const [deleteDocument] = useDeleteDocumentMutation();

  const handleDelete = async (
    id: number,
    workgroup_id: number
  ): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      setDeleting(id);
      await deleteDocument({ id, workgroup_id }).unwrap();
      toast.success("Document deleted successfully!");
      await refetch();
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document.");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (document: Document) => {
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

      if (newFilters.workgroup)
        updatedSearchParams.set("working_group", newFilters.workgroup);
      if (newFilters.status)
        updatedSearchParams.set("status", newFilters.status);
      if (newFilters.uploaded_at)
        updatedSearchParams.set("uploaded_at", newFilters.uploaded_at);
      setSearchParams(updatedSearchParams);
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      uploaded_at: "",
      workgroup: "",
      status: "",
    });
    setSearchParams({});
  };
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
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
            value={filters.uploaded_at}
            onChange={handleFilterChange}
            name="upload_at"
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
            value={filters.workgroup}
            onChange={handleFilterChange}
            name="workgroup"
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
            {GetDocuments?.data?.documents.map(
              (row, index) => (
                console.log("Row status:", row.status),
                (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
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
                          String(row.status) === "2"
                            ? "Approved"
                            : String(row.status) === "1"
                            ? "Pending"
                            : String(row.status) === "3"
                            ? "Rejected"
                            : ""
                        }
                        size="small"
                        sx={{
                          color:
                            String(row.status) === "2"
                              ? "green"
                              : String(row.status) === "1"
                              ? "#ff5e00"
                              : String(row.status) === "3"
                              ? "#bf1000"
                              : "",
                          backgroundColor:
                            String(row.status) === "2"
                              ? "#ccffc9"
                              : String(row.status) === "1"
                              ? "#ffe0a6"
                              : String(row.status) === "3"
                              ? "#fca69f"
                              : "",
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
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row.id, row.workgroup_id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={GetDocuments?.data?.pagination?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30]}
                labelRowsPerPage=""
                labelDisplayedRows={({ count }) => `${count} results`}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Editor
        open={isEditorOpen}
        onClose={handleEditorClose}
        selectedDocument={selectedDocument}
      />
    </Box>
  );
};

export default Documents;
