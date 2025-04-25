import express from 'express';
import { addTransfer } from '../controllers/addTransfer.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedTransfers } from '../controllers/addTransfer.js';

const router = express.Router();

router.post('/add', authenticateToken, addTransfer);
router.get('/paginated', authenticateToken, getPaginatedTransfers);

export default router;
