import prisma from '../prisma/client.js';

export const addIncome = async (req, res) => {
  const { name, amount, date, description, walletId } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    if (!wallet || wallet.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to add income to this wallet" });
    }

    const income = await prisma.income.create({
      data: {
        name,
        amount,
        date,
        description,
        walletId,
      },
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("Add income error:", error.message);
    res.status(500).json({ message: "Failed to add income" });
  }
};
