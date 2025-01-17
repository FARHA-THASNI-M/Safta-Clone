import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axiosInstance from '../api/axios';

interface EditorProps {
  open: boolean;
  onClose: () => void;
  selectedDocument?: DocumentType | null;
}

interface DocumentType {
  id: number;
  title: string;
  title_ar: string;
  deliverable?: string;
  description?: string;
  description_ar?: string;
  isPublic?: boolean;
  workgroup_id: string;
}

const Editor: React.FC<EditorProps> = ({ open, onClose, selectedDocument }) => {
  const [formData, setFormData] = useState<DocumentType>({
    id: selectedDocument?.id || 0,
    title: selectedDocument?.title || '',
    title_ar: selectedDocument?.title_ar || '',
    deliverable: selectedDocument?.deliverable || '',
    description: selectedDocument?.description || '',
    description_ar: selectedDocument?.description_ar || '',
    isPublic: selectedDocument?.isPublic || false,
    workgroup_id: selectedDocument?.workgroup_id || ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deliverables, setDeliverables] = useState<any[]>([]);

  useEffect(() => {
    if (selectedDocument?.workgroup_id && selectedDocument?.id) {
      const fetchDocumentData = async () => {
        try {
          const [documentResponse, deliverablesResponse] = await Promise.all([
            axiosInstance.get(`/workgroups/${selectedDocument.workgroup_id}/documents/${selectedDocument.id}?lang=en`),
            axiosInstance.get(`/workgroups/${selectedDocument.workgroup_id}/deliverables?lang=en`)
          ]);

          const docData = documentResponse.data.data.document;
          setFormData((prev) => ({
            ...prev,
            title: docData.title,
            title_ar: docData.title_ar,
            description: docData.description,
            description_ar: docData.description_ar,
            deliverable: docData.deliverable_name || '',
            isPublic: !!docData.public_at
          }));

          setDeliverables(deliverablesResponse.data.data.deliverables || []);
        } catch (error) {
          console.error("Error fetching document data:", error);
        }
      };
      fetchDocumentData();
    }
  }, [selectedDocument]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleChange = (field: keyof DocumentType) => (
    event: ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    const updateData = {
      title: formData.title,
      title_ar: formData.title_ar,
      deliverable_name: formData.deliverable,
      description: formData.description,
      Description_ar: formData.description_ar,
      public_at: formData.isPublic ? new Date().toISOString() : null,
    };

    try {
      await axiosInstance.patch(
        `/workgroups/${formData.workgroup_id}/documents/${formData.id}?lang=en`,
        updateData
      );
      alert('Document updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update document');
    }
  };

  const handleReset = () => {
    setFormData({
      id: selectedDocument?.id || 0,
      title: selectedDocument?.title || '',
      title_ar: selectedDocument?.title_ar || '',
      deliverable: selectedDocument?.deliverable || '',
      description: selectedDocument?.description || '',
      description_ar: selectedDocument?.description_ar || '',
      isPublic: selectedDocument?.isPublic || false,
      workgroup_id: selectedDocument?.workgroup_id || ''
    });
    setSelectedFile(null);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600 },
          padding: 3,
          overflow: 'visible', // Ensure content is not clipped
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}>
          <Typography fontWeight="bold" >Update Document</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, mt: 3, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              fullWidth
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
            />

            <TextField
              required
              fullWidth
              label="عنوان المستند"
              value={formData.title_ar}
              onChange={handleChange('title_ar')}
            />

            <FormControl fullWidth>
              <InputLabel>Deliverable</InputLabel>
              <Select
                value={formData.deliverable}
                onChange={handleChange('deliverable')}
              >
                {deliverables.map((deliverable) => (
                  <MenuItem key={deliverable.id} value={deliverable.name}>
                    {deliverable.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
            />

            <TextField
              fullWidth
              label="الوصف"
              multiline
              rows={4}
              value={formData.description_ar}
              onChange={handleChange('description_ar')}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
                  }
                />
              }
              label="Public"
            />

            {/* File Upload Section */}
            <Box>
              <Button
                component="label"
                sx={{
                  fontWeight: 'bold',
                  padding: '8px 16px', // Adding padding to increase button size
                  backgroundColor: '#f5f5f5', // Adding background color to make it more visible
                  borderRadius: '4px',
                  display: 'inline-flex', // Ensuring it's aligned properly
                  alignItems: 'center',
                }}
              >
                Upload document
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              {selectedFile && (
                <Paper sx={{
                  p: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f5f5f5',
                  marginTop: 1, // Adds spacing between file name and button
                }}>
                  <Typography variant="body2">{selectedFile.name}</Typography>
                  <IconButton size="small" onClick={handleRemoveFile}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{
          mt: 3,
          pt: 2,
          display: 'flex',
          gap: 2
        }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ color: 'black', borderColor: 'divider' }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor: 'black', color: 'white' }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Editor;
