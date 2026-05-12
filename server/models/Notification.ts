import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientType: { type: String, enum: ['all', 'individual'], default: 'all' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Used if recipientType is 'individual'
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
