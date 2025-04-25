import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';
import prisma from '../prisma/client.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/login', loginRateLimiter, loginUser);
router.post('/register', registerUser);
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
      const user = await prisma.user.findFirst({
        where: { verificationToken: token },
      });
  
      if (!user) return res.status(400).send('Invalid verification link.');
  
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null,
        },
      });
  
      res.send('Email verified successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  

export default router;