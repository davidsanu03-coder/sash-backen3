import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  formNumber: { type: String, required: true, unique: true },
  paymentReference: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['success', 'pending', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
