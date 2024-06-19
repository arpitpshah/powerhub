// ComplaintScreen.tsx
import React, { useState } from 'react';
import { Button, TextField, Typography, Snackbar, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerComplaintApi } from '../services/complaintApi';
import { addComplaintSuccess } from '../redux/actions/complaintActions';
import { RootState } from '../redux/store';
import { useFormik } from 'formik';
import * as yup from 'yup';

const ComplaintScreen: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: yup.object().shape({
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true)
        if (!auth.user || !auth.user.userId) {
          console.error('User or userId not found');
          return;
        }
        const userId = auth.user.userId;
        const token = localStorage.getItem('token');

        if (!token || !userId) {
          console.error('Token or userId not found');
          return;
        }

        const response = await registerComplaintApi(values.title, values.description, userId, token);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          formik.resetForm();
          setIsLoading(false)
        }, 500);

        dispatch(addComplaintSuccess(response.complaint));
        
      } catch (error) {
        console.error('Error registering complaint:', error);
      }
    },
  });


  return (
    <div style={{ textAlign: 'center', display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center', height:`calc(100vh - 68.5px)` }}>
      <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            borderRadius: 8,
            backgroundColor: '#28282B',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" sx={{color: '#ffffff'}}>Register a Complaint</Typography>
          
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#1c1c1c' } }}
          sx={{ '& fieldset': { color: '#ffffff', borderColor: '#1c1c1c' } }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          InputLabelProps={{ style: { color: '#ffffff' } }}
          InputProps={{ style: { color: '#ffffff', borderColor: '#1c1c1c' } }}
          sx={{ '& fieldset': { color: '#ffffff', borderColor: '#1c1c1c' } }}
        />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ):(
          <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '10px', backgroundColor: '#143d60', color: '#ffffff' }}
        >
          Submit Complaint
        </Button>
        )}
        
      </form>
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={2000}
        onClose={() => setShowSuccessMessage(false)}
        message="Complaint registered successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      
        </Box>
      
    </div>
  );
};

export default ComplaintScreen;
