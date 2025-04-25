import express from 'express';
import { createWallet } from '../controllers/walletController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedWallets } from '../controllers/walletController.js';

const router = express.Router();

router.post('/create', authenticateToken, createWallet);
router.get('/paginated', authenticateToken, getPaginatedWallets);

export default router;
