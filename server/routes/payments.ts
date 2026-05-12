import express from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import User from '../models/User.ts';
import Payment from '../models/Payment.ts';

const router = express.Router();

router.post('/initialize', authMiddleware, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Simulate Paystack-like logic
    // In a real app, this would call Paystack API and return a checkout URL
    const formNumber = "LUM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const paymentReference = "REF-" + Date.now();
    
    // We'll jump straight to 'success' for this demo/simulation
    const newPayment = new Payment({
      userId: req.userId,
      formNumber,
      paymentReference,
      amountPaid: 5000,
      paymentStatus: 'success'
    });

    await newPayment.save();
    
    user.hasPurchasedForm = true;
    await user.save();

    res.status(200).json({ message: "Payment successful", formNumber, paymentReference });
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

router.get('/status', authMiddleware, async (req: any, res) => {
  try {
    const payment = await Payment.findOne({ userId: req.userId, paymentStatus: 'success' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch payment status" });
  }
});

export default router;
