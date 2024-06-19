import express from 'express';
import { signup, login } from '../controllers/authController';

const router = express.Router();

// Define routes for user signup and login
router.post('/signup', signup); // Endpoint for user signup
router.post('/login', login);   // Endpoint for user login

export default router;
