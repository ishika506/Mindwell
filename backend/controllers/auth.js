import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // ✅ Password strength check (min 8 chars, uppercase, lowercase, number, special char)
    const passwordRules = [
      /.{8,}/,        // At least 8 chars
      /[A-Z]/,        // Uppercase
      /[a-z]/,        // Lowercase
      /[0-9]/,        // Number
      /[\W_]/         // Special char
    ];

    const passwordValid = passwordRules.every((rule) => rule.test(password));
    if (!passwordValid) {
      return res.status(400).json({ message: "Password is too weak. Must have 8+ chars, uppercase, lowercase, number, special char." });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        activities: newUser.activities || [],
        todayGoal: newUser.todayGoal || null,
      },
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* -----------------------------------
   SIGNIN
----------------------------------- */
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Required fields
    if (!email || !password) {
      return next(createError(400, "Email and password are required"));
    }

    // Gmail format check
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return next(createError(400, "Email must be a valid Gmail address"));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    // Password check
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password"));

    // JWT
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pwd, ...other } = user._doc;
    res.status(200).json({ token, user: other });
  } catch (err) {
    next(err);
  }
};

/* -----------------------------------
   SIGNOUT
----------------------------------- */
export const signout = async (req, res) => {
  res.status(200).json({ message: "Signed out successfully" });
};
