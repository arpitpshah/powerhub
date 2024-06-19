import { Request, Response } from 'express';
import { generatePDF } from '../services/pdfGenerator';
import { downloadPDFFromS3, listUserDocuments, uploadToS3 } from '../services/s3Service';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

// Function to generate and upload a PDF bill
export const generateAndUploadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, name, dateFrom, dateTo, units, cost, documentId } = req.body;
    const buffer = await generatePDF(userId, name, dateFrom, dateTo, units, cost);
    const filename = `${documentId}.pdf`;

    await uploadToS3(userId, Buffer.from(buffer), filename);

    res.status(200).json({ message: 'PDF generated and uploaded successfully.' });
    logToCloudWatch('PDF generation and upload successful', { userId, documentId });
  } catch (error) {
    console.error(error);
    logToCloudWatch('Error in PDF generation and upload', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to download a PDF bill
export const downloadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, documentId } = req.params;
    const pdfBuffer = await downloadPDFFromS3(userId, documentId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${documentId}.pdf`);
    res.send(pdfBuffer);
    logToCloudWatch('PDF download successful', { userId, documentId });
  } catch (error) {
    console.error(error);
    logToCloudWatch('Error in PDF download', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to list bills for a user
export const listBillsForUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;

  try {
    const documents = await listUserDocuments(userId);
    res.status(200).json({ documents });
    logToCloudWatch('Listing bills successful', { userId });
  } catch (error) {
    console.error(error);
    logToCloudWatch('Error listing bills', error);
    res.status(500).json({ error: 'Error listing bills' });
  }
};
