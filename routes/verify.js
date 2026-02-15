import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import Evidence from '../models/evidence.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });

// --- Verification Routes ---

// 1. Show Verification Page
router.get('/verify', async (req, res) => {
  const { id } = req.query;
  let preFetchedData = null;

  // If we came from the repository, pre-fill the form
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    preFetchedData = await Evidence.findById(id);
  }

  res.render('verify', { result: null, preFetched: preFetchedData });
});

// 2. Perform Integrity Check
router.post(['/verify', '/verify/:id'], upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId } = req.body;

    if (!req.file) {
      return res.status(400).send('Please upload a file to verify.');
    }

    // Calculate hash of the file the user just uploaded
    const fileBuffer = fs.readFileSync(req.file.path);
    const currentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Find the original record in our database
    let originalRecord;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      // Try finding by ID first
      originalRecord = await Evidence.findById(id);
    } else {
      // Or try finding by Case ID
      originalRecord = await Evidence.findOne({ caseId: caseId });
    }

    // Compare the hashes
    const isValid = (originalRecord && originalRecord.fileHash === currentHash);

    // Cleanup
    fs.unlinkSync(req.file.path);

    // Show results
    res.render('verify', {
      result: {
        valid: isValid,
        currentHash: currentHash,
        originalHash: originalRecord ? originalRecord.fileHash : null
      },
      preFetched: originalRecord || { caseId }
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).send("Verification failed.");
  }
});

export default router;
