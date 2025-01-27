import React from "react";
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: (event: SelectChangeEvent<number>) => void;
}

const TablePaginationActions: React.FC<TablePaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleArrowButtonClick = (direction: "back" | "next") => {
    const newPage = direction === "back" ? page - 1 : page + 1;
    onPageChange(null, newPage);
  };

  const handlePageClick = (
    _: React.MouseEvent<HTMLDivElement>,
    pageNumber: number
  ) => {
    onPageChange(null, pageNumber);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Select
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
          variant="standard"
          disableUnderline
          sx={{
            "& .MuiSelect-select": {
              py: 0,
              px: 1,
              color: "#666",
              fontSize: "0.875rem",
            },
            "& .MuiSelect-icon": {
              color: "#666",
            },
          }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
        <Box sx={{ color: "#666", fontSize: "0.875rem" }}>{count} results</Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => handleArrowButtonClick("back")}
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
              height: "32px",
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
          onClick={() => handleArrowButtonClick("next")}
          disabled={page >= totalPages - 1}
          sx={{ color: "#666" }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TablePaginationActions;
