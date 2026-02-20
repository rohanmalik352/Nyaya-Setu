import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

// Import Routes
import homeRoutes from './routes/home.js';
import evidenceRoutes from './routes/evidence.js';
import verifyRoutes from './routes/verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ----- Express Config -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----- MongoDB Connection -----
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    process.exit(1); // stop app if DB fails
  }
};

connectDB();

// ----- Routes -----
app.use('/', homeRoutes);
app.use('/', evidenceRoutes);
app.use('/', verifyRoutes);

// ----- Health Check (important for Render) -----
app.get('/', (req, res) => {
  res.send("🚀 Nyaya-Setu Server is Running");
});

// ----- Start Server -----
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});