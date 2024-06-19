import express from 'express';
import { getAllUserEnergyData } from '../controllers/energyConsumptionController';
import { authenticate } from '../middlewares/authmiddleware';

const router = express.Router();

// Endpoint for getting all user energy consumption data
router.get('/energy/:userId', authenticate, getAllUserEnergyData);

export default router;
