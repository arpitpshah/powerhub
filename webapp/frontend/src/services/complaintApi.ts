import { handleJsonResponse } from './api';

const apiUrl = process.env.REACT_APP_API_URL;

export const registerComplaintApi = async (
  title: string,
  description: string,
  userId: string,
  token: string
) => {
  try {
    const response = await fetch(`${apiUrl}api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, userId }),
    });

    return handleJsonResponse(response);
  } catch (error) {
    console.error('Error registering complaint:', error);
    throw new Error('Failed to register complaint');
  }
};

export const fetchUserComplaints = async (): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}api/user/complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return handleJsonResponse(response);
    } catch (error) {
      throw new Error('Failed to fetch user complaints');
    }
  };