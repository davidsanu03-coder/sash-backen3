import express from 'express';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.ts';
import Application from '../models/Application.ts';

const router = express.Router();

router.get('/:filename', authMiddleware, async (req: any, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Security check: Only the owner of the application or an admin can access
    const application = await Application.findOne({
      $or: [
        { userId: req.userId },
        { passportPhoto: `uploads/${filename}` },
        { uploadedDocuments: `uploads/${filename}` }
      ]
    });

    if (!application && req.userRole !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Error fetching file" });
  }
});

export default router;
