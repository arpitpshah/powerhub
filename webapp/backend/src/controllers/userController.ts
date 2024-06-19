import { Request, Response } from 'express';
import AWS from 'aws-sdk';
import bcrypt from 'bcrypt';
import { getAllUsersFromDynamoDB } from '../services/userService';
import { getUserFromDynamoDB } from './authController';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Retrieves all users.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDynamoDB();
    res.json(users);
    logToCloudWatch('Fetched all users', {});
  } catch (error) {
    console.error(error);
    logToCloudWatch('Error fetching all users', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Retrieves the email of a user based on their userId.
 * @param userId - The userId of the user.
 * @returns The email of the user if found, otherwise null.
 */
export const getUserEmail = async (userId: string): Promise<string | null> => {
  try {
    const user = await getUserFromDynamoDB('', userId);
    if (user && user.emailId) {
      return user.emailId;
    } else {
      console.error('User not found or missing email:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user email:', error);
    throw error;
  }
};

/**
 * Edits a user's information.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const editUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { emailId, firstName, lastName, password, role } = req.body;

  try {
    const existingUser = await getUserFromDynamoDB('', userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = {
      ...existingUser,
      emailId: emailId || existingUser.emailId,
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      password: password ? bcrypt.hashSync(password, 10) : existingUser.password,
      role: role || existingUser.role,
    };

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'userInfo',
      Key: { userId: userId },
      UpdateExpression: 'SET emailId = :emailId, firstName = :firstName, lastName = :lastName, password = :password, #userRole = :role',
      ExpressionAttributeValues: {
        ':emailId': updatedUser.emailId,
        ':firstName': updatedUser.firstName,
        ':lastName': updatedUser.lastName,
        ':password': updatedUser.password,
        ':role': updatedUser.role,
      },
      ExpressionAttributeNames: { "#userRole": "role" }
    };

    await dynamoDBClient.update(params).promise();
    res.json({ message: 'User updated successfully', user: updatedUser });
    logToCloudWatch('User updated', { userId });
  } catch (error) {
    console.error('Error updating user:', error);
    logToCloudWatch('Error updating user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Deletes a user.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  try {
    const existingUser = await getUserFromDynamoDB('', userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'userInfo',
      Key: { userId: userId },
    };

    await dynamoDBClient.delete(params).promise();
    res.json({ message: 'User deleted successfully', user: existingUser });
    logToCloudWatch('User deleted', { userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    logToCloudWatch('Error deleting user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};