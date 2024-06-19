import { Response } from 'express';
import { getAllEnergyDataFromDynamoDB } from '../services/energyConsumption';
import { AuthenticatedRequest } from '../middlewares/authmiddleware';
import { UserEnergyData } from '../types/energyConsumption.types';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

/**
 * Retrieves all energy data for a user.
 * @param req - Authenticated request object.
 * @param res - Express response object.
 */
export const getAllUserEnergyData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      logToCloudWatch('Attempt to fetch energy data without user authentication', {});
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const energyData: UserEnergyData[] = await getAllEnergyDataFromDynamoDB(userId);

    res.json({ energyData });
    logToCloudWatch('Fetched user energy data', { userId });
  } catch (error) {
    console.error('Error fetching user energy data:', error);
    logToCloudWatch('Error fetching user energy data', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
