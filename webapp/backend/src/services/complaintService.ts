import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { getUserEmail } from '../controllers/userController';
import { SNSHelper } from '../helpers/SNSHelper';
import { SQSHelper } from '../helpers/SQSHelper';
import { UserComplaint } from '../types/userComplaint.types';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

const dynamoDB = new DocumentClient({ region: 'us-east-1' });
const snsHelper = new SNSHelper();
const sqsHelper = new SQSHelper();

/**
 * Retrieves all complaints from DynamoDB for a specific user.
 * @param userId - The user ID for which to retrieve complaints.
 * @returns An array of UserComplaint objects.
 */
export const getAllComplaintsFromDynamoDB = async (userId: string): Promise<UserComplaint[]> => {
  const params: DocumentClient.ScanInput = {
    TableName: 'complaints', // Update with your complaints table name
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return result.Items as UserComplaint[];
  } catch (error) {
    console.error('Error fetching complaints from DynamoDB:', error);
    logToCloudWatch('Error fetching complaints from DynamoDB', error);
    throw error;
  }
};

/**
 * Adds a complaint to DynamoDB and manages notifications.
 * @param complaint - The complaint object to be added.
 */
export const addComplaintToDynamoDB = async (complaint: UserComplaint): Promise<void> => {
  const params: DocumentClient.PutItemInput = {
    TableName: 'complaints', // Update with your complaints table name
    Item: complaint,
  };

  try {
    await dynamoDB.put(params).promise();

    const userEmail = await getUserEmail(complaint.userId);
    if (!userEmail) {
      console.error('User email is null or undefined');
      logToCloudWatch('User email not found for complaint registration', { userId: complaint.userId });
      return;
    }

    const topicName = "powerHubSNSSQS";
    const snsTopicArn = await snsHelper.createTopic(topicName);

    if (!snsTopicArn) {
      console.error('Error creating SNS topic');
      logToCloudWatch('Error creating SNS topic', {});
      return;
    }

    let isSubscribed = await snsHelper.isUserSubscribed(snsTopicArn, userEmail);
    if (!isSubscribed) {
      await snsHelper.subscribeUser('email', snsTopicArn, userEmail);
    }

    const queueUrl = await sqsHelper.createQueue(topicName);
    if (!queueUrl) {
      console.error('Error creating SQS queue');
      logToCloudWatch('Error creating SQS queue', {});
      return;
    }

    await sqsHelper.sendConfirmationMessageToQueue(queueUrl, snsTopicArn, userEmail, complaint);
  } catch (error) {
    console.error('Error in addComplaintToDynamoDB:', error);
    logToCloudWatch('Error in addComplaintToDynamoDB', error);
    throw error;
  }
};
