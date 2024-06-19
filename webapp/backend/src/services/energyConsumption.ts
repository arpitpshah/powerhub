import AWS from 'aws-sdk';
import { UserEnergyData } from '../types/energyConsumption.types';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Retrieves all energy data for a specific user from DynamoDB.
 * @param userId - The user ID for which to retrieve energy data.
 * @returns An array of UserEnergyData objects.
 */
export const getAllEnergyDataFromDynamoDB = async (userId: string): Promise<UserEnergyData[]> => {
  const params = {
    TableName: process.env.ENERGY_TABLE_NAME || 'energyConsumption',
    KeyConditionExpression: 'userId = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
  };

  try {
    const data = await dynamoDb.query(params).promise();
    if (!data.Items) {
      return []; // Return an empty array if no items are found
    }

    const formattedData = data.Items.map((item) => {
      // Convert the ISO 8601 timestamp to a local date-time string
      const readableDate = new Date(item.timeStamp).toLocaleString();
      return { ...item, timeStamp: readableDate };
    }) as UserEnergyData[];

    return formattedData;
  } catch (error) {
    console.error('Error in DynamoDB Query: ', error);
    logToCloudWatch('Error fetching energy data from DynamoDB', error);
    throw error;
  }
};
