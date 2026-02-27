import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import ejsMate from 'ejs-mate';
import homeRoutes from './routes/home.js';
import evidenceRoutes from './routes/evidence.js';
import verifyRoutes from './routes/verify.js';
import user from './models/user.js';
import flash from "connect-flash"


import userrouter from './routes/user.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.engine("ejs", ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const dbUrl = process.env.MONGO_URI;


const secret = process.env.SECRET || "fallbacksecret";

app.use(session({
    store: MongoStore.create({
        mongoUrl: dbUrl,
        crypto: { secret: secret },
        touchAfter: 24 * 3600
    }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user; 
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(" MongoDB Error:", err);
    process.exit(1); 
  }
};

console.log("MONGO_URI:", process.env.MONGO_URI);
connectDB();


app.use('/', homeRoutes);
app.use('/', evidenceRoutes);
app.use('/', verifyRoutes);
app.use("/", userrouter);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});