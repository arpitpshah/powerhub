import { Request, Response } from 'express';
import { addComplaintToDynamoDB, getAllComplaintsFromDynamoDB } from '../services/complaintService';
import { AuthenticatedRequest } from '../middlewares/authmiddleware';
import { v4 as uuidv4 } from 'uuid';
import { UserComplaint } from '../types/userComplaint.types';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

/**
 * Registers a user complaint.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const registerComplaint = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;

    if (!userId) {
      logToCloudWatch('Attempt to register complaint without user authentication', {});
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const timeStamp = new Date().toISOString();
    const complaintId = generateComplaintId();

    const complaint = {
      userId,
      complaintId,
      timeStamp,
      title,
      description,
      status: 'Pending',
    };

    await addComplaintToDynamoDB(complaint);

    res.json({ message: 'Complaint registered successfully' });
    logToCloudWatch('Complaint registered', { complaintId, userId });
  } catch (error) {
    console.error('Error registering complaint:', error);
    logToCloudWatch('Error registering complaint', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Generates a unique complaint ID.
 * @returns A unique complaint ID.
 */
const generateComplaintId = (): string => {
  return uuidv4();
};

/**
 * Retrieves all complaints made by a user.
 * @param req - Authenticated request object.
 * @param res - Express response object.
 */
export const getAllUserComplaints = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      logToCloudWatch('Attempt to fetch complaints without user authentication', {});
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const complaints: UserComplaint[] = await getAllComplaintsFromDynamoDB(userId);

    res.json({ complaints });
    logToCloudWatch('Fetched user complaints', { userId });
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    logToCloudWatch('Error fetching user complaints', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
