import { handleJsonResponse } from './api';

const apiUrl = process.env.REACT_APP_API_URL;

export const listBillDocuments = async (
  userId: string,
) => {
  try {
    const response = await fetch(`${apiUrl}api/bill/list-documents/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return handleJsonResponse(response);
  } catch (error) {
    console.error('Error fetching list of bill documents:', error);
    throw new Error('Failed to fetch bills document');
  }
};

export const downloadBill = async (
  userId: string,
  documentId: string
) => {
  try {
    const response = await fetch(`${apiUrl}api/bill/download-pdf/${userId}/${documentId.split("_")[1]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return handleJsonResponse(response);
  } catch (error) {
    console.error('Error donwloading bill:', error);
    throw new Error('Failed to download bill');
  }
};
