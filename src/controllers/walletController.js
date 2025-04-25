import prisma from '../prisma/client.js';

export const createWallet = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await prisma.wallet.create({
      data: {
        name,
        description,
        userId,
      },
    });
    res.status(201).json(wallet);
  } catch (error) {
    console.error("Create wallet error:", error.message);
    res.status(500).json({ message: "Failed to create wallet" });
  }
};
export const getPaginatedWallets = async (req, res, next) => {
  const { page = 1, limit = 10, name } = req.query;
  const userId = req.user.id;

  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId,
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.wallet.count({
      where: {
        userId,
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
      },
    });

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: wallets,
    });
  } catch (err) {
    next(err);
  }
};


