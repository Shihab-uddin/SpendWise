import express from 'express';
import { getUserDashboard, getFilteredData } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/', authenticateToken, getUserDashboard);
router.get('/filter', authenticateToken, getFilteredData);

export default router;
