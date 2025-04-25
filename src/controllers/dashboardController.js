import prisma from '../prisma/client.js';

export const getUserDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all wallets with balances
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      include: {
        incomes: true,
        expenses: true,
        transfersFrom: true,
        transfersTo: true,
      },
    });

    // Optionally calculate totals
    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const allIncomes = wallets.flatMap(wallet => wallet.incomes);
    const allExpenses = wallets.flatMap(wallet => wallet.expenses);
    const allTransfers = [
      ...wallets.flatMap(wallet => wallet.transfersFrom),
      ...wallets.flatMap(wallet => wallet.transfersTo),
    ];

    res.status(200).json({
      totalBalance,
      wallets,
      allIncomes,
      allExpenses,
      allTransfers,
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
export const getFilteredData = async (req, res) => {
    const userId = req.user.id;
    const { walletId, month, year } = req.query;
  
    try {
      const filters = {
        wallet: {
          userId: Number(userId),
        },
      };
  
      // Filter by walletId if provided
      if (walletId) {
        filters.walletId = Number(walletId);
      }
  
      // Build date range filter if month and year are provided
      let dateFilter = {};
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        dateFilter = {
          gte: startDate,
          lte: endDate,
        };
      }
  
      // Fetch filtered data
      const incomes = await prisma.income.findMany({
        where: {
          ...filters,
          ...(month && year && { date: dateFilter }),
        },
      });
  
      const expenses = await prisma.expense.findMany({
        where: {
          ...filters,
          ...(month && year && { date: dateFilter }),
        },
      });
  
      const transfers = await prisma.transfer.findMany({
        where: {
          ...(walletId && {
            OR: [
              { fromWalletId: Number(walletId) },
              { toWalletId: Number(walletId) },
            ],
          }),
          ...(month && year && { date: dateFilter }),
        },
      });
  
      res.status(200).json({
        incomes,
        expenses,
        transfers,
      });
    } catch (error) {
      console.error('Filter error:', error.message);
      res.status(500).json({ message: 'Failed to filter data' });
    }
  };
  
