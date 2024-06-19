import express from 'express';
import { deleteUser, editUser, getAllUsers } from '../controllers/userController';

const router = express.Router();

// Endpoint for getting all users (admin)
router.get('/admin', getAllUsers);

// Endpoint for editing a user (admin)
router.put('/admin/:userId', editUser);

// Endpoint for deleting a user (admin)
router.delete('/admin/:userId', deleteUser);

export default router;
