import express from 'express';
import { addExpense } from '../controllers/expenseController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addExpense);

export default router;
