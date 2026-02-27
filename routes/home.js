import express from 'express';
import { isloggedin, isPolice } from '../../middleware.js';
const router = express.Router();


// HOME
router.get('/', (req, res) => {
  req.flash("success", "Welcome to Nyaya Setu!");
  res.redirect('/home');
});

router.get('/home', (req, res) => {
  res.render('index');
});

// ABOUT
router.get('/about', (req, res) => {
  req.flash("success", "Learn more about Nyaya Setu!");
  res.redirect('/about-page');
});

router.get('/about-page', (req, res) => {
  res.render('about');
});

// POLICE
router.get('/police', isloggedin,isPolice, (req, res) => {
  req.flash("success", "Welcome to the Police Dashboard!");
  res.redirect('/police-dashboard');
});

router.get('/police-dashboard',isloggedin,isPolice, (req, res) => {
  res.render('police');
});

export default router;