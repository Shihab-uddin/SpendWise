import prisma from '../prisma/client.js';

export const addExpense = async (req, res) => {
  const { name, amount, description, date, walletId } = req.body;
  const userId = req.user.id;

  try {
    // Validate wallet
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: userId,
      },
    });

    if (!wallet) {
      return res.status(403).json({ message: "Wallet not found or unauthorized" });
    }

    // Ensure balance is sufficient
    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Add the expense
    const expense = await prisma.expense.create({
      data: {
        name,
        amount,
        description,
        date: new Date(date),
        walletId,
      },
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error.message);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

export const getPaginatedExpenses = async (req, res, next) => {
  const { page = 1, limit = 10, walletId, startDate, endDate } = req.query;
  const userId = req.user.id;

  try {
    const where = {
      wallet: { userId },
      ...(walletId && { walletId: parseInt(walletId) }),
      ...(startDate && endDate && {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const expenses = await prisma.expense.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { date: 'desc' },
    });

    const total = await prisma.expense.count({ where });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: expenses,
    });
  } catch (err) {
    next(err);
  }
};

