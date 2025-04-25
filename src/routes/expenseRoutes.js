import express from 'express';
import { addExpense } from '../controllers/expenseController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedExpenses } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/add', authenticateToken, addExpense);
router.get('/paginated', authenticateToken, getPaginatedExpenses);

export default router;
