NYAYA-SETU

Blockchain-powered, tamper-proof digital evidence management system for the 
Indian judiciary

License: MIT
Node.js: >= 14.0.0
Status: Active


OVERVIEW

Nyaya-Setu is a cutting-edge digital evidence management system designed 
specifically for the Indian judicial system. It leverages blockchain 
technology, cryptographic hashing, and decentralized storage to ensure the 
integrity, authenticity, and immutability of digital evidence throughout the 
chain of custody.

KEY FEATURES

* Blockchain-Powered Security: Immutable records of all evidence transactions
* SHA-256 Hashing: Cryptographic verification of evidence integrity
* IPFS Storage: Decentralized storage ensuring evidence availability and 
  redundancy
* Chain of Custody Tracking: Complete audit trail from evidence collection 
  to presentation
* Verifiable Records: Transparent and tamper-proof blockchain records
* Judicial Compliance: Built with Indian legal system requirements in mind


PROBLEM STATEMENT

Digital evidence tampering and lack of transparent chain of custody tracking 
have been significant challenges in the Indian judiciary. Nyaya-Setu addresses 
these concerns by:

* Preventing unauthorized modifications to digital evidence
* Creating transparent, verifiable audit trails
* Ensuring evidence authenticity from collection to court presentation
* Restoring trust in digital evidence for legal proceedings


ARCHITECTURE

                    +-------------------+
                    |  Web Interface    |
                    |    (Views)        |
                    +---------+---------+
                              |
                    +---------v---------+
                    |   Express.js      |
                    |     Server        |
                    +---------+---------+
                              |
                         +----+----+
                         |         |
                  +------v---+ +---v--------+
                  | MongoDB  | | Blockchain |
                  |  (Meta)  | | (Records)  |
                  +----------+ +-----+------+
                                     |
                                +----v----+
                                |  IPFS   |
                                |(Storage)|
                                +---------+


GETTING STARTED

PREREQUISITES

* Node.js (v14.0.0 or higher)
* npm or yarn
* MongoDB (v4.0 or higher)
* IPFS node (optional for local development)

INSTALLATION

Step 1: Clone the repository
    git clone https://github.com/rohanmalik352/Nyaya-Setu.git
    cd Nyaya-Setu

Step 2: Install dependencies
    npm install

Step 3: Configure environment variables
    # Create a .env file in the root directory
    cp .env.example .env
    
    # Edit .env with your configurations:
    # - MongoDB connection string
    # - Blockchain network settings
    # - IPFS gateway URL
    # - Port configuration

Step 4: Initialize the database
    npm run init-db

Step 5: Start the server
    npm start

The application should now be running on http://localhost:3000 (or your 
configured port).


PROJECT STRUCTURE

Nyaya-Setu/
├── init/               # Initialization scripts
├── models/             # Database schemas and models
├── public/             # Static assets (CSS, JS, images)
├── routes/             # API and page routes
├── views/              # EJS templates
├── server.js           # Main application entry point
├── package.json        # Dependencies and scripts
└── .gitignore         # Git ignore rules


HOW IT WORKS

1. EVIDENCE UPLOAD

* User uploads digital evidence through the web interface
* File is hashed using SHA-256 algorithm
* Original file is stored on IPFS
* Hash and IPFS CID are recorded on blockchain

2. CHAIN OF CUSTODY

* Every interaction with evidence is recorded as a blockchain transaction
* Includes: uploader identity, timestamp, action type, previous hash
* Creates an immutable audit trail

3. VERIFICATION

* Anyone can verify evidence integrity by:
  - Comparing current hash with blockchain record
  - Retrieving original file from IPFS using CID
  - Checking transaction history on blockchain

4. ACCESS CONTROL

* Role-based access for different judicial stakeholders
* Officers, lawyers, judges have different permission levels
* All access attempts are logged on blockchain


TECHNOLOGY STACK

BACKEND

* Node.js: Runtime environment
* Express.js: Web application framework
* MongoDB: Database for metadata and user information

FRONTEND

* EJS: Templating engine
* CSS: Styling
* JavaScript: Client-side interactions

BLOCKCHAIN & STORAGE

* SHA-256: Cryptographic hashing algorithm
* IPFS: Decentralized file storage
* Blockchain: Immutable record keeping (specific implementation TBD)


API DOCUMENTATION

EVIDENCE MANAGEMENT

Upload Evidence
    Endpoint: POST /api/evidence/upload
    Content-Type: multipart/form-data
    
    Request Body:
    {
      "file": <binary>,
      "caseId": "string",
      "description": "string",
      "uploadedBy": "string"
    }

Verify Evidence
    Endpoint: GET /api/evidence/verify/:evidenceId
    
    Response:
    {
      "isValid": boolean,
      "hash": "string",
      "ipfsCID": "string",
      "blockchainTxId": "string",
      "chainOfCustody": []
    }

Get Evidence History
    Endpoint: GET /api/evidence/history/:evidenceId
    
    Response:
    {
      "evidenceId": "string",
      "transactions": [
        {
          "timestamp": "ISO 8601",
          "action": "string",
          "actor": "string",
          "hash": "string"
        }
      ]
    }


SECURITY FEATURES

* Immutability: Once recorded on blockchain, evidence records cannot be 
  altered
* Cryptographic Verification: SHA-256 ensures data integrity
* Decentralized Storage: IPFS prevents single point of failure
* Access Logging: All access attempts are permanently recorded
* Role-Based Access Control: Ensures only authorized personnel can access 
  evidence


CONTRIBUTING

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

CODING STANDARDS

* Follow ES6+ JavaScript standards
* Use meaningful variable and function names
* Comment complex logic
* Write unit tests for new features


LICENSE

This project is licensed under the MIT License - see the LICENSE file for 
details.


AUTHORS

* Rohan Malik - @rohanmalik352 (https://github.com/rohanmalik352)


ACKNOWLEDGMENTS

* Indian Judiciary for the problem statement
* Blockchain community for technical guidance
* IPFS for decentralized storage infrastructure
* All contributors who have helped shape this project


CONTACT & SUPPORT

For questions, suggestions, or issues:
* Open an issue on GitHub
* Email: [Your contact email]
* Documentation: [Link to detailed docs if available]


ROADMAP

[ ] Integration with government identity systems (Aadhaar, etc.)
[ ] Mobile application for field officers
[ ] Advanced analytics and reporting
[ ] Multi-language support (Hindi, regional languages)
[ ] Integration with existing court management systems
[ ] AI-powered evidence analysis
[ ] Real-time evidence sharing between courts


DISCLAIMER

This system is designed to enhance evidence management in judicial proceedings. 
Users should ensure compliance with all applicable laws and regulations 
regarding digital evidence handling in their jurisdiction.


Built with care for the Indian Judiciary
Restoring Trust in Digital Evidence
