import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pinataSDK from '@pinata/sdk';
import Evidence from '../models/evidence.js';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Setup file upload storage (Temporary)
const upload = multer({ dest: path.join(__dirname, '../uploads') });

// Connect to IPFS (Pinata)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

// --- Evidence Routes ---

// 1. Show the Repository
router.get('/evidence', async (req, res) => {
  try {
    const allEvidence = await Evidence.find({});
    res.render('show', { evidences: allEvidence });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Could not load evidence.");
  }
});

// 2. Upload Evidence
router.post('/evidence/upload-api', upload.single('file'), async (req, res) => {
  try {
    const { caseId, officerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file found' });
    }

    // Calculate a unique digital fingerprint (Hash)
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Send the file to IPFS (The Decentralized Cloud)
    const readableStream = fs.createReadStream(req.file.path);
    const options = {
      pinataMetadata: {
        name: req.file.originalname,
        keyvalues: { caseId, officerId }
      },
      pinataOptions: { cidVersion: 1 }
    };
    const pinataResult = await pinata.pinFileToIPFS(readableStream, options);

    // Save record to our database
    // Note: We mark blockchain status as "Pending" until the user confirms via MetaMask
    const newEvidence = await Evidence.create({
      caseId: caseId,
      officerId: officerId,
      fileName: req.file.originalname,
      fileHash: fileHash,
      ipfsCID: pinataResult.IpfsHash,
      blockchainTxHash: 'PENDING_SIGNATURE',
      originalFileType: req.file.mimetype,
    });

    // Cleanup local file
    fs.unlinkSync(req.file.path);

    // Tell the frontend we are ready for the blockchain step
    res.json({
      success: true,
      dbId: newEvidence._id,
      fileHash: fileHash,
      caseId: caseId
    });

  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, error: 'Upload Failed' });
  }
});

// 3. Confirm Blockchain Transaction
router.post('/evidence/confirm-tx', async (req, res) => {
  try {
    const { dbId, txHash } = req.body;

    // Update the record with the confirmed transaction hash
    await Evidence.findByIdAndUpdate(dbId, { blockchainTxHash: txHash });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 4. Download Golden Copy
router.get('/evidence/retrieve/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).send("Not found.");

    const { ipfsCID, fileName } = evidence;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsCID}`;

    // Fetch the file from IPFS Gateway
    const response = await fetch(gatewayUrl);

    if (!response.ok) {
      return res.status(500).send("Could not download file from IPFS.");
    }

    // Prepare download for the user
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/octet-stream");

    // Stream the file data to the user
    Readable.fromWeb(response.body).pipe(res);

  } catch (error) {
    console.error("Retrieval Error:", error);
    return res.status(500).send("Error retrieving file.");
  }
});

export default router;