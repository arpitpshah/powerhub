import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

const dynamoDB = new DocumentClient({ region: 'us-east-1' });

/**
 * Retrieves all users from the DynamoDB table.
 * @returns An array of user items from the DynamoDB table.
 */
export const getAllUsersFromDynamoDB = async (): Promise<any[]> => {
  const params: DocumentClient.ScanInput = {
    TableName: process.env.USER_TABLE_NAME || 'userInfo',
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items || [];
  } catch (error) {
    console.error('Error fetching users from DynamoDB:', error);
    logToCloudWatch('Error fetching users from DynamoDB', error);
    throw error;
  }
};
