import prisma from '../prisma/client.js';

export const createWallet = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  console.log("das" ,userId);

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
