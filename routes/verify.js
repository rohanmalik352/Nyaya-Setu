import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import Evidence from '../models/evidence.js';
import { isJudge, isloggedin } from "../../middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '../uploads') });

router.get('/verify', isloggedin,isJudge, async (req, res) => {
  const { id } = req.query;
  let preFetchedData = null;

  if (id && mongoose.Types.ObjectId.isValid(id)) {
    preFetchedData = await Evidence.findById(id);
  }

  res.render('verify', { result: null, preFetched: preFetchedData });
});

router.post(['/verify', '/verify/:id'], isloggedin,isJudge, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { caseId } = req.body;

    if (!req.file) {
      return res.status(400).send('Please upload a file to verify.');
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const currentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');


    let originalRecord;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
 
      originalRecord = await Evidence.findById(id);
    } else {
 
      originalRecord = await Evidence.findOne({ caseId: caseId });
    }

   
    const isValid = (originalRecord && originalRecord.fileHash === currentHash);

    fs.unlinkSync(req.file.path);
      

  
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
