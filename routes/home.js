import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/police', (req, res) => {
  res.render('police');
});

export default router;
