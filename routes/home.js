import express from 'express';

const router = express.Router();

// --- Home Route ---
// This handles the main landing page of the application.
router.get('/', (req, res) => {
  res.render('index.ejs');
});

export default router;
