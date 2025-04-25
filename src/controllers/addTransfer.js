import prisma from '../prisma/client.js';

export const addTransfer = async (req, res) => {
  const { amount, description, date, fromWalletId, toWalletId } = req.body;
  const userId = req.user.id;

  try {
    // Validate both wallets
    const fromWallet = await prisma.wallet.findFirst({
      where: { id: fromWalletId, userId },
    });

    const toWallet = await prisma.wallet.findFirst({
      where: { id: toWalletId, userId },
    });

    if (!fromWallet || !toWallet) {
      return res.status(403).json({ message: 'Invalid wallets or not authorized' });
    }

    if (fromWalletId === toWalletId) {
      return res.status(400).json({ message: 'Cannot transfer to the same wallet' });
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance in source wallet' });
    }

    // Start the transfer and update balances
    const transfer = await prisma.transfer.create({
      data: {
        amount,
        description,
        date: new Date(date),
        fromWalletId,
        toWalletId,
      },
    });

    // Update wallet balances
    await prisma.wallet.update({
      where: { id: fromWalletId },
      data: { balance: { decrement: amount } },
    });

    await prisma.wallet.update({
      where: { id: toWalletId },
      data: { balance: { increment: amount } },
    });

    res.status(201).json(transfer);
  } catch (error) {
    console.error("Transfer error:", error.message);
    res.status(500).json({ message: "Transfer failed" });
  }
};

export const getPaginatedTransfers = async (req, res, next) => {
    const { page = 1, limit = 10, walletId, startDate, endDate } = req.query;
    const userId = req.user.id;
  
    try {
      const where = {
        OR: [
          { fromWallet: { userId } },
          { toWallet: { userId } },
        ],
        ...(walletId && {
          OR: [
            { fromWalletId: parseInt(walletId) },
            { toWalletId: parseInt(walletId) },
          ],
        }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      };
  
      const transfers = await prisma.transfer.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          fromWallet: true,
          toWallet: true,
        },
      });
  
      const total = await prisma.transfer.count({ where });
  
      res.json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: transfers,
      });
    } catch (err) {
      next(err);
    }
  };
  
  
