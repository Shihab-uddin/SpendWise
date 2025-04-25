import express from 'express';
import { addTransfer } from '../controllers/addTransfer.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addTransfer);

export default router;
