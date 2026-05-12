import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role, hasPurchasedForm: newUser.hasPurchasedForm } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Seed admin if doesn't exist (FOR DEVELOPMENT ONLY)
    if (email === 'SASHLEARNINGHUB@EMAIL.COM' && password === 'adminPassword2026') {
      let admin = await User.findOne({ email: 'SASHLEARNINGHUB@EMAIL.COM' });
      if (!admin) {
        const hashedPassword = await bcrypt.hash('adminPassword2026', 12);
        admin = new User({ 
          fullName: 'System Admin', 
          email: 'SASHLEARNINGHUB@EMAIL.COM', 
          password: hashedPassword,
          role: 'admin'
        });
        await admin.save();
      }
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, hasPurchasedForm: user.hasPurchasedForm } });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
