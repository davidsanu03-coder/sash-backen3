import express from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import Application from '../models/Application.ts';
import User from '../models/User.ts';
import Payment from '../models/Payment.ts';
import Notification from '../models/Notification.ts';

const router = express.Router();

const isAdmin = (req: any, res: any, next: any) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalApplicants = await User.countDocuments({ role: 'student' });
    const completedApplications = await Application.countDocuments();
    const totalRevenue = (await Payment.countDocuments({ paymentStatus: 'success' })) * 5000;

    res.status(200).json({
      totalApplicants,
      completedApplications,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get('/applicants', authMiddleware, isAdmin, async (req, res) => {
  try {
    const applicants = await Application.find().populate('userId', 'fullName email');
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
});

router.get('/students', authMiddleware, isAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('fullName email');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

router.patch('/application/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(req.params.id, { applicationStatus: status }, { new: true });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

router.post('/announcement', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { title, message, recipientType, recipientId } = req.body;
    const notification = new Notification({
      title,
      message,
      recipientType,
      recipientId: recipientType === 'individual' ? recipientId : null
    });
    await notification.save();
    res.status(201).json({ message: "Announcement sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send announcement" });
  }
});

export default router;
