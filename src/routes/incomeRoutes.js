import express from 'express';
import { addIncome } from '../controllers/incomeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addIncome);

export default router;
