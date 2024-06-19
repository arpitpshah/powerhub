import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AWS from 'aws-sdk';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import billRoutes from './routes/billRoutes';
import { authenticate } from './middlewares/authmiddleware';
import { getUserData } from './controllers/authController';
import complaintRoutes from './routes/complaintRoutes';
import energyRoute from './routes/energyRoute';

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const app = express();

app.use(cors());
app.use(bodyParser.json());

export const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' });

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bill', billRoutes);
app.get('/user-data', authenticate, getUserData);
app.use('/api', complaintRoutes);
app.use('/api', energyRoute);

export default app;
