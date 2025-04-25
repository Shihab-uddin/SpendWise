import express from 'express';
import { addIncome } from '../controllers/incomeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedIncomes } from '../controllers/incomeController.js';

const router = express.Router();

router.post('/add', authenticateToken, addIncome);
router.get('/paginated', authenticateToken, getPaginatedIncomes);

export default router;
