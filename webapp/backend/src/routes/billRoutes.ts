import express from 'express';
import { downloadPDF, generateAndUploadPDF, listBillsForUser } from '../controllers/billController';

const router = express.Router();

// Endpoint for generating and uploading PDF
router.post('/generate-bill', generateAndUploadPDF);

// Endpoint for downloading PDF
router.get('/download-pdf/:userId/:documentId', downloadPDF);

// Endpoint for listing bills for a user
router.get('/list-documents/:userId', listBillsForUser);

export default router;