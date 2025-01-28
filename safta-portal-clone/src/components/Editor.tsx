import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { toast } from "react-toastify";
import {
  useGetDocumentQuery,
  useGetDeliverablesQuery,
  useUpdateDocumentMutation,
} from "../services/documents/documentService";
import { Document, DocumentFormData } from "../services/documents/types";

interface EditorProps {
  open: boolean;
  onClose: () => void;
  selectedDocument?: Document | null;
}

const documentSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must be 150 characters or less"),
  title_ar: z
    .string()
    .max(150, "Arabic title must be 150 characters or less")
    .optional(),
  deliverable: z.string().optional(),
  description: z
    .string()
    .max(600, "Description must be 600 characters or less")
    .optional()
    .nullable(),
  description_ar: z
    .string()
    .max(600, "Arabic description must be 600 characters or less")
    .optional()
    .nullable(),
  isPublic: z.boolean(),
  workgroup_id: z.string(),
});

type FormData = z.infer<typeof documentSchema>;

const Editor: React.FC<EditorProps> = ({ open, onClose, selectedDocument }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFile, setExistingFile] = useState<{
    original_name: string;
    file_url: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: documentData } = useGetDocumentQuery(
    {
      workgroupId: selectedDocument?.workgroup_id || "",
      documentId: selectedDocument?.id || 0,
    },
    { skip: !selectedDocument }
  );

  const { data: deliverablesData } = useGetDeliverablesQuery(
    selectedDocument?.workgroup_id || "",
    { skip: !selectedDocument }
  );

  const [updateDocument] = useUpdateDocumentMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      id: selectedDocument?.id?.toString() || 0,
      title: selectedDocument?.title || "",
      title_ar: selectedDocument?.title_ar || "",
      deliverable: selectedDocument?.deliverable_name || "",
      description: selectedDocument?.description || "",
      description_ar: selectedDocument?.description_ar || "",
      isPublic: !!selectedDocument?.public_at,
      workgroup_id: selectedDocument?.workgroup_id || "",
    },
  });
  const watchedValues = watch();

  useEffect(() => {
    if (documentData?.data.document) {
      const doc = documentData.data.document;
      reset({
        id: doc.id,
        title: doc.title,
        title_ar: doc.title_ar || "",
        deliverable: doc.deliverable_name || "",
        description: doc.description || "",
        description_ar: doc.description_ar || "",
        isPublic: !!doc.public_at,
        workgroup_id: doc.workgroup_id,
      });

      if (doc.original_name && doc.file_url) {
        setExistingFile({
          original_name: doc.original_name,
          file_url: doc.file_url,
        });
      }
    }
  }, [documentData, reset]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10 mb.");
        return;
      }
      setSelectedFile(file);
      setExistingFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExistingFile(null);
  };

  console.log(errors);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", data.title);
      formDataToSend.append("title_ar", data.title_ar || "");
      if (data.deliverable) {
        formDataToSend.append("deliverable_name", data.deliverable);
      }
      if (data.description) {
        formDataToSend.append("description", data.description);
      }
      if (data.description_ar) {
        formDataToSend.append("description_ar", data.description_ar);
      }
      formDataToSend.append(
        "public_at",
        data.isPublic ? new Date().toISOString() : ""
      );

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      await updateDocument({
        workgroupId: data.workgroup_id,
        documentId: data.id,
        formData: formDataToSend,
      }).unwrap();

      toast.success("Document updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    if (documentData?.data.document) {
      const doc = documentData.data.document;
      if (doc.original_name && doc.file_url) {
        setExistingFile({
          original_name: doc.original_name,
          file_url: doc.file_url,
        });
      }
    }
  };
  const isFormValid =
    watchedValues.title &&
    watchedValues.title.length > 0 &&
    (selectedFile || existingFile) &&
    Object.keys(errors).length === 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 700 },
          padding: "25px 35px",
          bgcolor: "#fff",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
            Update Document
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ p: 0 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ flex: 1, mt: 3, overflow: "auto" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>
                    Title<span style={{ color: "red" }}>*</span>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => <>{field.value.length}/150</>}
                    />
                  </Typography>
                </Box>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="textSecondary">
                    <Controller
                      name="title_ar"
                      control={control}
                      render={({ field }) => <>{field?.value?.length}/150</>}
                    />
                  </Typography>
                  <Typography>عنوان المستند</Typography>
                </Box>
                <Controller
                  name="title_ar"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      error={!!errors.title_ar}
                      helperText={errors.title_ar?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            <Box>
              <Typography sx={{ mb: 0.5, fontSize: "14px" }}>
                Deliverable
              </Typography>
              <FormControl fullWidth size="small">
                <Controller
                  name="deliverable"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      sx={{
                        backgroundColor: "#fff",
                        "& .MuiSelect-select": {
                          padding: "8.5px 14px",
                        },
                      }}
                    >
                      {deliverablesData?.data.deliverables.map(
                        (deliverable) => (
                          <MenuItem
                            key={deliverable.id}
                            value={deliverable.name}
                          >
                            {deliverable.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>

            <Box
              sx={{
                backgroundColor: "#F8F9FA",
                borderRadius: "4px",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "12px", color: "#666", mb: 1 }}>
                Max. Doc Size 10 mb
              </Typography>
              <Button
                component="label"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
                variant="outlined"
              >
                Upload document<span style={{ color: "red" }}>*</span>
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
            </Box>

            {(selectedFile || existingFile) && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  border: "1px solid #eee",
                  borderRadius: "4px",
                }}
              >
                <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "14px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedFile
                    ? selectedFile.name
                    : existingFile?.original_name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  sx={{ p: 0 }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Description</Typography>
                  <Typography variant="caption" color="textSecondary">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <>{field.value?.length || 0}/600</>
                      )}
                    />
                  </Typography>
                </Box>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="textSecondary">
                    <Controller
                      name="description_ar"
                      control={control}
                      render={({ field }) => (
                        <>{field.value?.length || 0}/600</>
                      )}
                    />
                  </Typography>
                  <Typography>الوصف</Typography>
                </Box>
                <Controller
                  name="description_ar"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description_ar}
                      helperText={errors.description_ar?.message}
                    />
                  )}
                />
              </Box>
            </Box>

            <Controller
              name="isPublic"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                      sx={{
                        color: "#000",
                        "&.Mui-checked": {
                          color: "black",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "14px" }}>Public</Typography>
                  }
                />
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            pt: 2,
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleReset}
            disabled={isSubmitting}
            sx={{
              color: "black",
              borderColor: "black",
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            sx={{
              bgcolor: "black",
              color: "white",
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Editor;
