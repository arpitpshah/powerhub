import { Request, Response  } from 'express';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { dynamoDBClient } from '../app';
import { AuthenticatedRequest  } from '../middlewares/authmiddleware';
import { logToCloudWatch } from '../utils/cloudwatchLogger';


/**
 * Registers a new user.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const signup = async (req: Request, res: Response) => {
  const { emailId, password, role = 'user', firstName, lastName } = req.body;
  
  try {
    // Checking if the user already exists
    if (await userExists(emailId)) {
      logToCloudWatch('Signup attempt with existing username', { emailId });
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hashing the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Preparing item for DynamoDB
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME || 'userInfo',
      Item: {
        userId: generateUniqueId(),
        emailId,
        firstName,
        lastName,
        password: hashedPassword,
        role,
      },
    };

    // Adding the user to DynamoDB
    await dynamoDBClient.put(params).promise();
    res.json({ message: 'User registered successfully', user: { firstName, lastName } });
    logToCloudWatch('User registered successfully', { userId: params.Item.userId, emailId });
  } catch (error) {
    console.error('Error adding user to DynamoDB', error);
    logToCloudWatch('Error during signup', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Authenticates a user.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const login = async (req: Request, res: Response) => {
  const { emailId, password } = req.body;

  try {
    // Retrieving user from DynamoDB
    const user = await getUserFromDynamoDB(emailId);

    // Verifying password and generating JWT token
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { userId: user.userId, emailId: user.emailId, role: user.role },
        process.env.JWT_SECRET || "arpitshah",
        { expiresIn: '1h' }
      );

      res.json({ token, user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
      logToCloudWatch('Invalid login attempt', { emailId });
    }
  } catch (error) {
    console.error('Error during login', error);
    logToCloudWatch('Error during login', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


async function userExists(emailid: string) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME || 'userInfo',
    FilterExpression: 'emailId = :emaild',
    ExpressionAttributeValues: {
      ':emaild': emailid,
    },
  };

  try {
    const result = await dynamoDBClient.scan(params).promise();

    if (result.Items && result.Items.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error scanning DynamoDB:', error);
    throw error;
  }
}

// Function to get user from DynamoDB
export async function getUserFromDynamoDB(emailid: string, userid?: string) {

  const FilterExpressionValue = userid?'userId = :userid':'emailId = :emailid'
  const ExpressionAttributeData = userid?{':userid':userid}:{':emailid': emailid}
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME || 'userInfo',
    FilterExpression: FilterExpressionValue,
    ExpressionAttributeValues: ExpressionAttributeData,
  };

  try {
    const result = await dynamoDBClient.scan(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    } else {
      console.error('User not found:', emailid);
      return null;
    }
  } catch (error) {
    console.error('Error scanning DynamoDB:', error);
    throw error;
  }
}

export const getUserData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user information from the request (assuming the user information is stored in req.user)
    const { userId, emailId, role } = req.user || {};

    // Fetch user data from DynamoDB based on the extracted information
    const userData = await getUserFromDynamoDB(emailId);

    // Return the user data
    res.json({ userId, emailId, role, userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to generate a unique user ID
function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}


