import express from 'express';
import { authMiddleware } from '../middleware/auth.ts';
import Notification from '../models/Notification.ts';

const router = express.Router();

// Get notifications for the logged-in student
router.get('/', authMiddleware, async (req: any, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientType: 'all' },
        { recipientId: req.userId }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
});

export default router;
