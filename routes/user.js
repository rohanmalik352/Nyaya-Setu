import express from "express";
import User from "../models/user.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

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
    res.redirect("/verify");
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup failed: " + err.message);
  }
});
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {
  res.redirect("/");
});
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  })}); 
export default router;