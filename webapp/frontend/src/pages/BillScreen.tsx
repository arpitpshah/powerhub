// BillGenerationComponent.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { RootState } from '../redux/store';
import DownloadIcon from '@mui/icons-material/GetApp';
import { listBillDocuments } from '../services/billApi';

interface Document {
  key: string;
  lastModified: string;
  size: number;
}

const BillGenerationComponent: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!userId) {
        alert('User ID is missing');
        return;
      }
      setIsLoading(true);
      try {
        const response = await listBillDocuments(userId);
        const data = response;
        setDocuments(data.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
      setIsLoading(false);
    };

    fetchDocuments();
  }, [userId]);

  const handleDownloadBill = (documentKey: string) => {

    const documentId = documentKey.split('/')[1];

    if (!userId || !documentId) {
      alert('User ID or Document ID is missing');
      return;
    }
    window.location.href=`http://powerhubbackend.us-east-1.elasticbeanstalk.com/api/bill/download-pdf/${userId}/${documentId.split(".")[0]}`;
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: '80vw', overflow: 'auto', mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
          Bill Management
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.key} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell component="th" scope="row">
                      {formatDate(doc.lastModified)}
                    </TableCell>
                    <TableCell>{formatBytes(doc.size)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDownloadBill(doc.key)} aria-label="download" size="large">
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default BillGenerationComponent;
