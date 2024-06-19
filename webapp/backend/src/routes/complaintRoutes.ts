import express from 'express';
import { authenticate } from '../middlewares/authmiddleware';
import { getAllUserComplaints, registerComplaint } from '../controllers/complaintController';

const router = express.Router();

// Endpoint for registering a complaint
router.post('/complaints', authenticate, registerComplaint);

// Endpoint for getting all complaints for a user
router.get('/user/complaints', authenticate, getAllUserComplaints);

export default router;
