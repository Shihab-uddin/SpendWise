import express from "express"
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';
import walletRoutes from './routes/walletRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // only needed if you're using cookies or sessions
  })
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/transfer', transferRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('SpendWise API is running 🚀');
});

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
