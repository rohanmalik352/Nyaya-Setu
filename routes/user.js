import express from "express";
import User from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../../middleware.js";

const router = express.Router();

// --- SIGNUP PAGE ---
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// --- SIGNUP LOGIC ---
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, role, officerId, judgeId } = req.body;

    const newUser = new User({
      username,
      email,
      role,
      officerId: role === "police" ? officerId : undefined,
      judgeId: role === "judge" ? judgeId : undefined
    });

    await User.register(newUser, password);

    // ✅ FLASH SUCCESS
    req.flash("success", "Signup successful! Please log in.");
    res.redirect("/login"); 

  } catch (err) {
    console.error(err);

    // ✅ FLASH ERROR
    req.flash("error", err.message);
    res.redirect("/signup");   
  }
});

// --- LOGIN PAGE ---
router.get("/login", (req, res) => {
  res.render("users/login");
});

// --- LOGIN LOGIC ---
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back, " + req.user.username + "!");

    const redirectUrl = res.locals.redirectUrl || "/";
    res.redirect(redirectUrl);
  }
);

// --- LOGOUT ---
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Logout failed.");
      return res.redirect("/");
    }

    req.flash("success", "You have been logged out.");
    res.redirect("/login");
  });
});

export default router;