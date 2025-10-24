import express from 'express';
import multer from 'multer';
import { TextToolsController } from './controllers/TextToolsController';

const router = express.Router();
const upload = multer();

// Sort text endpoint
router.post('/sort', TextToolsController.sortText);

// File upload endpoint
router.post('/upload', upload.single('file'), TextToolsController.uploadFile);

// Export CSV endpoint
router.post('/export/csv', TextToolsController.exportCsv);

// Frontend logging endpoint
router.post('/log', (req, res) => {
  const { level, message, meta } = req.body;
  console.log(`[FRONTEND] ${level}: ${message}`, meta || '');
  res.status(200).json({ success: true });
});

export default router;
