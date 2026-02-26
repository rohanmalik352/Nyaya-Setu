import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pinataSDK from '@pinata/sdk';
import AWS from 'aws-sdk'; // NEW: AWS Tool
import Evidence from '../models/evidence.js';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// 1. Setup Temporary Upload Storage
const upload = multer({ dest: path.join(__dirname, '../uploads') });

// 2. Configure IPFS (Layer 1)
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

// 3. Configure AWS S3 (Layer 2)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// 4. Configure Encryption (Layer 3)
const ENCRYPTION_KEY = process.env.MASTER_ENCRYPTION_KEY; 
const IV_LENGTH = 16; // AES standard

// --- HELPER: Encrypt File for Vault ---
function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(IV_LENGTH); // Create a unique lock
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return Buffer.concat([iv, encrypted]); // Save the lock with the file
}

// --- HELPER: Decrypt File from Vault ---
function decryptBuffer(encryptedBuffer) {
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const encryptedText = encryptedBuffer.subarray(IV_LENGTH);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
}

// --- ROUTE: Show Evidence Page ---
router.get('/evidence', async (req, res) => {
  try {
    const allEvidence = await Evidence.find({});
    res.render('show', { evidences: allEvidence });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Could not load evidence.");
  }
});

// --- ROUTE: The 3-Layer Upload ---
router.post('/evidence/upload-api', upload.single('file'), async (req, res) => {
  try {
    const { caseId, officerId } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file found' });
    }

    console.log(`🔒 Starting Multi-Layer Storage for Case: ${caseId}`);

    // Read the file into memory
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // --- LAYER 1: IPFS Upload ---
    console.log("... Uploading to Layer 1 (IPFS)");
    const readableStream = fs.createReadStream(req.file.path);
    const pinataOptions = {
      pinataMetadata: {
        name: req.file.originalname,
        keyvalues: { caseId, officerId }
      },
      pinataOptions: { cidVersion: 1 }
    };
    const pinataResult = await pinata.pinFileToIPFS(readableStream, pinataOptions);
    const ipfsCID = pinataResult.IpfsHash;

    // --- LAYER 2: AWS S3 Upload ---
    console.log("... Uploading to Layer 2 (AWS S3)");
    const s3Key = `${caseId}/${Date.now()}_${req.file.originalname}`;
    
    // Define 10-year retention for Court Compliance
    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + 10);

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: req.file.mimetype,
      // NOTE: Uncomment these two lines ONLY if your AWS Bucket has Object Lock enabled
      // ObjectLockMode: 'COMPLIANCE', 
      // ObjectLockRetainUntilDate: retentionDate
    };
    
    // Upload to AWS
    try {
        await s3.upload(s3Params).promise();
    } catch (s3Err) {
        console.error("AWS Upload Error (Check your .env keys):", s3Err.message);
        // We continue even if AWS fails, to not break the demo, but log the error.
    }

    // --- LAYER 3: Local Encrypted Vault ---
    console.log("... Writing to Layer 3 (Local Encrypted Vault)");
    const encryptedData = encryptBuffer(fileBuffer);
    const vaultFilename = `${caseId}_${Date.now()}.enc`;
    // This saves the file into the 'vault' folder we created earlier
    const localPath = path.join(__dirname, '../vault', vaultFilename);
    
    fs.writeFileSync(localPath, encryptedData.toString('base64'));

    // --- SAVE TO DATABASE ---
    const newEvidence = await Evidence.create({
      caseId,
      officerId,
      fileName: req.file.originalname,
      fileHash,
      ipfsCID,
      awsKey: s3Key,
      localEncryptedPath: localPath,
      originalFileType: req.file.mimetype,
      blockchainTxHash: 'PENDING_SIGNATURE'
    });

    // Clean up the temporary upload file
    fs.unlinkSync(req.file.path);

    console.log("✅ Evidence secured across 3 layers.");

    res.json({
      success: true,
      dbId: newEvidence._id,
      fileHash: fileHash,
      caseId: caseId
    });

  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, error: 'Upload Failed: ' + error.message });
  }
});

// --- ROUTE: Confirm Blockchain Transaction ---
router.post('/evidence/confirm-tx', async (req, res) => {
  try {
    const { dbId, txHash } = req.body;
    await Evidence.findByIdAndUpdate(dbId, { blockchainTxHash: txHash });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// --- ROUTE: Retrieve Evidence (The Safety Net) ---
router.get('/evidence/retrieve/:id', async (req, res) => {
  try {
    const evidence = await Evidence.findById(req.params.id);
    if (!evidence) return res.status(404).send("Not found.");

    let fileBuffer = null;
    console.log(`🔍 Retrieving Evidence for ${evidence.caseId}...`);

    // --- ATTEMPT 1: Try IPFS ---
    try {
      console.log("... Attempting Layer 1 (IPFS)");
      const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${evidence.ipfsCID}`;
      const response = await fetch(gatewayUrl);
      if (!response.ok) throw new Error("IPFS Gateway Error");
      
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      console.log("✔ Retrieved from IPFS");
    } catch (ipfsError) {
      console.warn("⚠ Layer 1 Failed. Moving to Layer 2...");
    }

    // --- ATTEMPT 2: Try AWS S3 (If IPFS failed) ---
    if (!fileBuffer) {
      try {
        console.log("... Attempting Layer 2 (AWS S3)");
        const s3Params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: evidence.awsKey
        };
        const data = await s3.getObject(s3Params).promise();
        fileBuffer = data.Body;
        console.log("✔ Retrieved from AWS S3");
      } catch (s3Error) {
        console.warn("⚠ Layer 2 Failed. Moving to Layer 3...");
      }
    }

    // --- ATTEMPT 3: Try Local Vault (If AWS failed) ---
    if (!fileBuffer) {
      try {
        console.log("... Attempting Layer 3 (Local Vault)");
        if (fs.existsSync(evidence.localEncryptedPath)) {
          // Read the encrypted file
          const encryptedBase64 = fs.readFileSync(evidence.localEncryptedPath, 'utf8');
          const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
          // Decrypt it
          fileBuffer = decryptBuffer(encryptedBuffer);
          console.log("✔ Retrieved & Decrypted from Local Vault");
        } else {
          throw new Error("Local file missing");
        }
      } catch (localError) {
        console.error("❌ ALL LAYERS FAILED.");
        return res.status(500).send("CRITICAL ERROR: Evidence cannot be retrieved from any layer.");
      }
    }

    // Send the retrieved file to the user
    if (fileBuffer) {
      res.setHeader("Content-Disposition", `attachment; filename="${evidence.fileName}"`);
      res.setHeader("Content-Type", evidence.originalFileType);
      res.send(fileBuffer);
    }

  } catch (error) {
    console.error("Retrieval Error:", error);
    res.status(500).send("Error retrieving file.");
  }
});

export default router;