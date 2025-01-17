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
  FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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

interface DocumentFile {
  original_name: string;
  file_url: string;
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
  const [existingFile, setExistingFile] = useState<DocumentFile | null>(null);
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

          if (docData.original_name && docData.file_url) {
            setExistingFile({
              original_name: docData.original_name,
              file_url: docData.file_url
            });
          }

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
      setExistingFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setExistingFile(null);
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
    const formDataToSend = new FormData();
    
    formDataToSend.append('title', formData.title);
    formDataToSend.append('title_ar', formData.title_ar);
    if (formData.deliverable) {
      formDataToSend.append('deliverable_name', formData.deliverable);
    }
    if (formData.description) {
      formDataToSend.append('description', formData.description);
    }
    if (formData.description_ar) {
      formDataToSend.append('description_ar', formData.description_ar);
    }
    formDataToSend.append('public_at', formData.isPublic ? new Date().toISOString() : '');
    
    if (selectedFile) {
      formDataToSend.append('file', selectedFile);
    }

    try {
      await axiosInstance.patch(
        `/workgroups/${formData.workgroup_id}/documents/${formData.id}?lang=en`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
    
    if (selectedDocument?.workgroup_id && selectedDocument?.id) {
      const fetchDocumentData = async () => {
        try {
          const response = await axiosInstance.get(`/workgroups/${selectedDocument.workgroup_id}/documents/${selectedDocument.id}?lang=en`);
          const docData = response.data.data.document;
          if (docData.original_name && docData.file_url) {
            setExistingFile({
              original_name: docData.original_name,
              file_url: docData.file_url
            });
          }
        } catch (error) {
          console.error("Error fetching document data:", error);
        }
      };
      fetchDocumentData();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          padding: '20px 24px',
          bgcolor: '#fff',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
            Update Document
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ p: 0 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title Fields */}
            <Box sx={{ position: 'relative' }}>
              <Typography sx={{ 
                position: 'absolute', 
                right: 0, 
                top: -18, 
                fontSize: '12px', 
                color: '#666' 
              }}>
                5/150  10/150
              </Typography>
              <Typography sx={{ mb: 0.5, fontSize: '14px' }}>Title*</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="title"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ mb: 0.5, fontSize: '14px' }}>عنوان المستند</Typography>
              <TextField
                fullWidth
                size="small"
                value={formData.title_ar}
                onChange={handleChange('title_ar')}
                placeholder="asdasdsad"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>

            {/* Deliverable Dropdown */}
            <Box>
              <Typography sx={{ mb: 0.5, fontSize: '14px' }}>Deliverable</Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.deliverable}
                  onChange={handleChange('deliverable')}
                  displayEmpty
                  sx={{ 
                    backgroundColor: '#fff',
                    '& .MuiSelect-select': {
                      padding: '8.5px 14px',
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select deliverable</em>
                  </MenuItem>
                  {deliverables.map((deliverable) => (
                    <MenuItem key={deliverable.id} value={deliverable.name}>
                      {deliverable.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Upload Document Section */}
            <Box sx={{ 
              backgroundColor: '#F8F9FA',
              borderRadius: '4px',
              p: 2,
              textAlign: 'center'
            }}>
              <Typography sx={{ fontSize: '12px', color: '#666', mb: 1 }}>
                Max. Doc Size 10 mb
              </Typography>
              <Button
                component="label"
                sx={{
                  color: '#000',
                  borderColor: '#000',
                  textTransform: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderColor: '#000'
                  }
                }}
                variant="outlined"
              >
                Upload document*
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
            </Box>

            {/* File Display */}
            {(selectedFile || existingFile) && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                border: '1px solid #eee',
                borderRadius: '4px'
              }}>
                <InsertDriveFileIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ 
                  flex: 1,
                  fontSize: '14px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}>
                  {selectedFile ? selectedFile.name : existingFile?.original_name}
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

            {/* Description Fields */}
            <Box sx={{ position: 'relative' }}>
              <Typography sx={{ 
                position: 'absolute', 
                right: 0, 
                top: -18, 
                fontSize: '12px', 
                color: '#666' 
              }}>
                0/800  0/800
              </Typography>
              <Typography sx={{ mb: 0.5, fontSize: '14px' }}>Description</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Enter description"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>

            <Box>
              <Typography sx={{ mb: 0.5, fontSize: '14px' }}>الوصف</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.description_ar}
                onChange={handleChange('description_ar')}
                placeholder="Enter description in Arabic"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Box>

            {/* Public Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
                  }
                  sx={{
                    color: '#000',
                    '&.Mui-checked': {
                      color: '#000',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontSize: '14px' }}>Public</Typography>
              }
            />
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{
          mt: 2,
          pt: 2,
          display: 'flex',
          gap: 1,
          borderTop: '1px solid #eee',
        }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              flex: 1,
              textTransform: 'none',
              color: '#000',
              borderColor: '#eee',
              height: '36px',
              '&:hover': {
                borderColor: '#ccc',
                backgroundColor: 'transparent'
              }
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              flex: 1,
              textTransform: 'none',
              bgcolor: '#000',
              height: '36px',
              '&:hover': {
                bgcolor: '#222'
              }
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