import express from 'express';
import { createWallet } from '../controllers/walletController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createWallet);

export default router;
