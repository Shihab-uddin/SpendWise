import express from 'express';
import { addIncome, updateIncome, deleteIncome } from '../controllers/incomeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedIncomes } from '../controllers/incomeController.js';

const router = express.Router();

router.post('/add', authenticateToken, addIncome);
router.get('/paginated', authenticateToken, getPaginatedIncomes);
router.put('/update/:id', authenticateToken, updateIncome); // ✅ New
router.delete('/delete/:id', authenticateToken, deleteIncome);

export default router;
