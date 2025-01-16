import React, { useState, ChangeEvent } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface EditorProps {
  open: boolean;
  onClose: () => void;
  selectedDocument?: DocumentType | null;
}

interface DocumentType {
  id: number;
  title: string;
  deliverable?: string;
  description?: string;
  isPublic?: boolean;
}

const Editor: React.FC<EditorProps> = ({ open, onClose, selectedDocument }) => {
  const [formData, setFormData] = useState<DocumentType>({
    id: selectedDocument?.id || 0,
    title: selectedDocument?.title || '',
    deliverable: selectedDocument?.deliverable || '',
    description: selectedDocument?.description || '',
    isPublic: selectedDocument?.isPublic || false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleChange = (field: keyof DocumentType) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Selected File:', selectedFile);
  };

  const handleReset = () => {
    setFormData({
      id: selectedDocument?.id || 0,
      title: '',
      deliverable: '',
      description: '',
      isPublic: false,
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
          <Typography fontWeight="bold">Update Document</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, mt: 3, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography sx={{ marginBottom:0, paddingBottom:0}}>Title <Box component="span" sx={{color:'red'}}>*</Box></Typography>
            <TextField
            sx={{ marginTop:0, paddingTop:0}}
              label=""
              required
              fullWidth
              value={formData.title}
              onChange={handleChange('title')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="textSecondary">
                      {formData.title.length}/150
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Typography>Deliverable</Typography>
            <TextField
              label=""
              fullWidth
              value={formData.deliverable}
              onChange={handleChange('deliverable')}
            />
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  Max. Doc Size 10 mb
                </Typography>
              </Box>
              
              <Button
                component="label"
                fullWidth
                sx={{
                  color:'black',
                  backgroundColor:'lightgray',
                  py: 2,
                  textTransform: 'none'
                }}
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                Upload document 
              </Button> 

              {selectedFile && (
                <Paper
                  sx={{
                    mt: 1,
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <Typography variant="body2">{selectedFile.name}</Typography>
                  <IconButton size="small" onClick={handleRemoveFile}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Paper>
              )}
            </Box>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="textSecondary">
                      {formData.description?.length || 0}/500
                    </Typography>
                  </InputAdornment>
                ),
              }}
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
          </Box>
        </Box>

        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 1 
        }}>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              color: 'black',
              borderColor: 'divider',
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: 'black',
              color: 'white',
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