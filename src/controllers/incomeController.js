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

    const total = await prisma.income.count({ where });

    const incomes = await prisma.income.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { date: 'desc' },
      include: {
        wallet: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      data: incomes,
    });
  } catch (err) {
    next(err);
  }
};

export const updateIncome = async (req, res) => {
  const incomeId = parseInt(req.params.id);
  const userId = req.user.id;
  const { name, amount, description, date, walletId } = req.body;
  const newWalletId = parseInt(walletId);

  try {
    const income = await prisma.income.findFirst({
      where: {
        id: incomeId,
        wallet: {
          userId: userId,
        },
      },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }

    const oldAmount = income.amount;
    const oldWalletId = income.walletId;

    // If wallet changed: revert from old and add to new
    if (oldWalletId !== newWalletId) {
      await prisma.wallet.update({
        where: { id: oldWalletId },
        data: {
          balance: { decrement: oldAmount },
        },
      });

      await prisma.wallet.update({
        where: { id: newWalletId },
        data: {
          balance: { increment: amount },
        },
      });
    } else {
      // Wallet is the same — adjust only the difference
      const difference = amount - oldAmount; // e.g. 2000 - 1500 = +500

      if (difference !== 0) {
        await prisma.wallet.update({
          where: { id: oldWalletId },
          data: {
            balance: {
              increment: difference, // positive if increasing, negative if decreasing
            },
          },
        });
      }
    }

    const updatedIncome = await prisma.income.update({
      where: { id: incomeId },
      data: {
        name,
        amount,
        description,
        date: new Date(date),
        walletId: newWalletId,
      },
    });

    res.json(updatedIncome);
  } catch (error) {
    console.error("Update income error:", error.message);
    res.status(500).json({ message: "Failed to update income" });
  }
};


export const deleteIncome = async (req, res) => {
  const incomeId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const income = await prisma.income.findFirst({
      where: {
        id: incomeId,
        wallet: {
          userId: userId,
        },
      },
    });

    if (!income) {
      return res.status(404).json({ message: "Income not found or unauthorized" });
    }

    // Revert income amount from wallet
    await prisma.wallet.update({
      where: { id: income.walletId },
      data: {
        balance: {
          decrement: income.amount,
        },
      },
    });

    await prisma.income.delete({
      where: { id: incomeId },
    });

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Delete income error:", error.message);
    res.status(500).json({ message: "Failed to delete income" });
  }
};


