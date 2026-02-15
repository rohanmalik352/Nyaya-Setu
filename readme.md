# NYAYA-SETU ⚖️

> **The Future of Digital Evidence Management.**
> A Blockchain-powered, Sci-Fi themed, tamper-proof system for the Indian Judiciary.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/deploy-on%20vercel-black.svg)](https://vercel.com/new)

## 🌌 OVERVIEW

Nyaya-Setu is a next-generation digital evidence management platform. It combines the immutability of **Blockchain** with the decentralized storage of **IPFS** to create an unalterable chain of custody for digital evidence.

Wrapped in a futuristic **Sci-Fi / Cyberpunk interface**, it simplifies complex cryptographic operations for Police Officers and Judges.

### Key Features
*   **🛡️ Tamper-Proof**: Evidence hashes are stored on the Ethereum Blockchain.
*   **💾 Decentralized Storage**: Files are secured on IPFS (via Pinata), ensuring no single point of failure.
*   **🔍 Instant Verification**: Verify any file's integrity against its immutable blockchain record in milliseconds.
*   **🪙 Golden Copy**: Automatically retrieve the original, authentic file from IPFS if a local copy is tampered with.
*   **👽 Sci-Fi UI**: A visually stunning, dark-mode interface with glassmorphism and animations.
*   **☁️ Vercel Ready**: Optimized for serverless deployment.

---

## 🛠️ PROJECT STRUCTURE

The codebase has been **"Humanized"** for clarity and ease of understanding.

```
Nyaya-Setu/
├── models/             # Database Schemas (MongoDB)
├── public/             # Static Assets (CSS, JS, Images)
├── routes/             # Simple, Modular Logic
│   ├── home.js         # Landing Page & Dashboard
│   ├── evidence.js     # Upload, List, & Retrieve Evidence
│   └── verify.js       # File Verification Logic
├── views/              # Sci-Fi EJS Templates
├── server.js           # Main Server Entry Point
└── vercel.json         # Deployment Configuration
```

---

## 🚀 GETTING STARTED

### Prerequisites
*   Node.js (v18+)
*   MongoDB Account (Atlas or Local)
*   Pinata Account (for IPFS)
*   MetaMask Browser Extension

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/rohanmalik352/Nyaya-Setu.git
    cd Nyaya-Setu
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PINATA_API_KEY=your_pinata_api_key
    PINATA_API_SECRET=your_pinata_secret_key
    ```

4.  **Run Locally**
    ```bash
    npm start
    # Server runs on http://localhost:3000
    ```

---

## 🦊 METAMASK SETUP GUIDE

Nyaya-Setu uses **MetaMask** to sign transactions on the blockchain. Follow these steps if you are a first-time user:

### Step 1: Install MetaMask
1.  Go to [metamask.io](https://metamask.io/download/).
2.  Install the extension for Chrome, Firefox, or Edge.
3.  Click the Fox icon in your browser toolbar.

### Step 2: Create a Wallet
1.  Click **"Create a new wallet"**.
2.  Set a strong password.
3.  **IMPORTANT**: Write down your **Secret Recovery Phrase** on paper and store it safely. Never share this with anyone!

### Step 3: Connect to Nyaya-Setu
1.  Open Nyaya-Setu in your browser.
2.  When you click **"+ Log New Evidence"**, MetaMask will popup asking for permission to connect.
3.  Click **"Connect"**.
4.  You are now ready to secure evidence on the blockchain!

---

## 📖 USAGE GUIDE

### 1. Police Dashboard (Upload)
*   Click **"+ Log New Evidence"**.
*   Enter the `Case ID`, `Officer ID`, and select your file.
*   Click **"Upload"**.
*   **MetaMask** will pop up to sign the transaction. Confirm it to permanently record the evidence hash on the blockchain.

### 2. Evidence Repository
*   View all logged evidence in a sleek, Sci-Fi grid.
*   Click **"View Data"** to see the file on IPFS.
*   Click **"Golden Copy"** to download the guaranteed original file.

### 3. Verification Portal
*   Click **"Verify"** next to any evidence.
*   Upload a suspect file.
*   The system compares its hash against the Blockchain Record.
*   **Green**: Evidence is Authentic.
*   **Red**: Evidence is Tampered. (You will be offered the "Golden Copy").

---

## ☁️ DEPLOYMENT (VERCEL)

This project is optimized for Vercel.

1.  Push your code to **GitHub**.
2.  Import the repo in **Vercel**.
3.  Add your Environment Variables (`MONGO_URI`, `PINATA_API_KEY`, `PINATA_API_SECRET`) in the Vercel Dashboard.
4.  Click **Deploy**.

---

## 👥 AUTHORS

*   **Rohan Malik** - [@rohanmalik352](https://github.com/rohanmalik352)
*   **Manvi** - [@Manvi100203](https://github.com/Manvi100203)
*   **Harsh Panchal** - [@Harsh-Panchal-1](https://github.com/Harsh-Panchal-1)
*   **Naman Chaudhary** - [@Naman1313](https://github.com/Naman1313)

## 📄 LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Built for the Ministry of Law and Justice & Ministry of Home Affairs (MHA)**
