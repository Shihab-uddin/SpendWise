import express from 'express';
import { addTransfer, editTransfer, deleteTransfer } from '../controllers/addTransfer.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedTransfers } from '../controllers/addTransfer.js';

const router = express.Router();

router.post('/add', authenticateToken, addTransfer);
router.get('/paginated', authenticateToken, getPaginatedTransfers);
router.put('/edit/:id', authenticateToken, editTransfer);
router.delete('/delete/:id', authenticateToken, deleteTransfer);

export default router;
