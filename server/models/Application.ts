import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  passportPhoto: { type: String },
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  jambScore: { type: Number, required: true },
  selectedSubjects: [String],
  extraCurriculars: [String],
  oLevelResults: [{
    subject: String,
    grade: String
  }],
  uploadedDocuments: [String],
  applicationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
