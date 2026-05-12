import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.ts';
import Application from '../models/Application.ts';
import User from '../models/User.ts';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/submit', authMiddleware, upload.fields([
  { name: 'passportPhoto', maxCount: 1 },
  { name: 'uploadedDocuments', maxCount: 10 }
]), async (req: any, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.hasPurchasedForm) {
      return res.status(403).json({ message: "Purchase admission form first" });
    }

    const files = req.files || {};
    const passportPhoto = files['passportPhoto'] ? files['passportPhoto'][0].path : null;
    const uploadedDocuments = files['uploadedDocuments'] ? files['uploadedDocuments'].map((f: any) => f.path) : [];

    const applicationData = {
      ...req.body,
      userId: req.userId,
      passportPhoto,
      uploadedDocuments,
      oLevelResults: JSON.parse(req.body.oLevelResults || '[]'),
      selectedSubjects: JSON.parse(req.body.selectedSubjects || '[]'),
      extraCurriculars: JSON.parse(req.body.extraCurriculars || '[]')
    };

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Application submission failed" });
  }
});

router.get('/my-application', authMiddleware, async (req: any, res) => {
  try {
    const application = await Application.findOne({ userId: req.userId });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch application" });
  }
});

export default router;
