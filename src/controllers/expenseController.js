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

export const editExpense = async (req, res) => {
  const expenseId = parseInt(req.params.id);
  const userId = req.user.id;
  const { name, amount, description, date, walletId } = req.body;
  const newWalletId = parseInt(walletId); // Ensure Int

  try {
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { wallet: true }
    });

    if (!existingExpense || existingExpense.wallet.userId !== userId) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    const oldAmount = existingExpense.amount;
    const oldWalletId = existingExpense.walletId;

    // If wallet changed, refund old and deduct from new
    if (oldWalletId !== newWalletId) {
      // Refund to old wallet
      await prisma.wallet.update({
        where: { id: oldWalletId },
        data: { balance: { increment: oldAmount } },
      });

      // Deduct from new wallet
      await prisma.wallet.update({
        where: { id: newWalletId },
        data: { balance: { decrement: amount } },
      });
    } else {
      // Same wallet: adjust difference
      const difference = oldAmount - amount;

      if (difference !== 0) {
        await prisma.wallet.update({
          where: { id: oldWalletId },
          data: {
            balance: {
              increment: difference // if difference = 500 (1500 → 1000), increment 500
            }
          }
        });
      }
    }

    // Update expense
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name,
        amount,
        description,
        date: new Date(date),
        walletId: newWalletId,
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error('Edit expense error:', error.message);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};



export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
      include: { wallet: true }
    });

    if (!expense || expense.wallet.userId !== userId) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    // Refund the expense amount to the wallet
    await prisma.wallet.update({
      where: { id: expense.walletId },
      data: { balance: { increment: expense.amount } },
    });

    await prisma.expense.delete({ where: { id: parseInt(id) } });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error.message);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

