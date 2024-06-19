import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { logToCloudWatch } from '../utils/cloudwatchLogger';

// Extend the Request type to include the user property
export interface AuthenticatedRequest extends Request {
  user?: any; // Update the type of user as per your user object
}

/**
 * Middleware to authenticate users based on JWT token.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logToCloudWatch('Authentication attempt without token', {});
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, decoded) => {
    if (err) {
      logToCloudWatch('JWT verification failed', { error: err.message });
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded; // Attach user information to the request object
    next();
  });
};
