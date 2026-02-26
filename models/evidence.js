import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
    caseId: {
        type: String,
        required: true
    },
    officerId: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    // LAYER 1: IPFS (Public Decentralized)
    ipfsCID: {
        type: String,
        required: true
    },
    // LAYER 2: AWS S3 (Cloud Backup)
    awsKey: {
        type: String,
        required: true
    },
    // LAYER 3: Local Vault (Encrypted Safety Net)
    localEncryptedPath: {
        type: String,
        required: true
    },
    // Verification Data
    fileHash: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        default: 'PENDING_SIGNATURE'
    },
    originalFileType: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Evidence = mongoose.model('Evidence', evidenceSchema);
export default Evidence;