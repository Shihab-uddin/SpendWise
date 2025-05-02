import express from 'express';
import { createWallet, updateWallet, deleteWallet } from '../controllers/walletController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { getPaginatedWallets } from '../controllers/walletController.js';

const router = express.Router();

router.post('/create', authenticateToken, createWallet);
router.get('/paginated', authenticateToken, getPaginatedWallets);
router.put('/update/:id', authenticateToken, updateWallet);
router.delete('/delete/:id', authenticateToken, deleteWallet);

export default router;
