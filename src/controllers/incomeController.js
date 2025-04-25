import prisma from '../prisma/client.js';

export const addIncome = async (req, res) => {
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

    // Add the income
    const income = await prisma.income.create({
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
          increment: amount,
        },
      },
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Add income error:", error.message);
    res.status(500).json({ message: "Failed to add income" });
  }
};

export const getPaginatedIncomes = async (req, res, next) => {
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

    const incomes = await prisma.income.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { date: 'desc' },
      include: {
        wallet: true,
      },
    });

    const total = await prisma.income.count({ where });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: incomes,
    });
  } catch (err) {
    next(err);
  }
};

