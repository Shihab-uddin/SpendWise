import express from 'express';
import { addExpense, editExpense, deleteExpense } from '../controllers/expenseController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedExpenses } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/add', authenticateToken, addExpense);
router.get('/paginated', authenticateToken, getPaginatedExpenses);
router.put('/edit/:id', authenticateToken, editExpense);
router.delete('/delete/:id', authenticateToken, deleteExpense);

export default router;
