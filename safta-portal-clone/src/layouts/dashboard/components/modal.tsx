import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ open, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <ErrorIcon sx={{ fontSize: 40 }} />
      <DialogTitle>Confirm Logout</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "grey" }}>
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "black",
            background: "white",
            border: "1px solid black",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{ color: "white", background: "black" }}
          variant="contained"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
