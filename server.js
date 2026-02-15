import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

// Import Modular Routes
import homeRoutes from './routes/home.js';
import evidenceRoutes from './routes/evidence.js';
import verifyRoutes from './routes/verify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ----- Express Configuration -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse JSON bodies

// ----- Database Connection -----
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) {
      console.error("❌ Error: MONGO_URI is missing in .env file!");
      // Don't exit process in Vercel environment, just log error
      if (process.env.NODE_ENV !== 'production') process.exit(1);
    } else {
      // Check if already connected (for serverless hot-reload)
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(dbURI);
        console.log("✅ Connected to MongoDB: nyaya-setu");
      }
    }
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

// Initialize DB connection immediately
connectDB();

// ----- Route Registration -----
// Connect the route files to our app
app.use('/', homeRoutes);
app.use('/', evidenceRoutes);
app.use('/', verifyRoutes);

// ----- Start Server -----
// Only listen if not running in Vercel (Vercel exports the app)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

// Export for Vercel Serverless
export default app;
