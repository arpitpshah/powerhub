import { handleJsonResponse } from "./api";

const apiUrl = process.env.REACT_APP_API_URL;


export const listEnergyData = async (
    userId: string
  ) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}api/energy/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return handleJsonResponse(response);
    } catch (error) {
      console.error('Error registering complaint:', error);
      throw new Error('Failed to register complaint');
    }
  };