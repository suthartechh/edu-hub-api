import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// ENV or default
const JWT_SECRET = process.env.JWT_SECRET || "suthar";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "manmohansu7@gmail.com",
    pass: "sszm cpoc jpfa cgpc",
  },
});

// Generate a OTP

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
     
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const otpVerified = false;

    const newUser = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
      otpVerified,
    });

    // Send OTP via email

    await transporter.sendMail({
      from: "manmohansu7@gmail.com",
      to: email,
      subject: "Verify Your Email",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check OTP match and expiry
    if (
      user.otp !== otp ||
      !user.otpExpiry || 
      user.otpExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 4. Mark as verified
    user.otpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // 5. Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. Respond
    return res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Error verifying OTP. Please try again later.",
    });
  }
};
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpVerified= false; 
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await user.save();

    await transporter.sendMail({
      from:"manmohansu7@gmail.com",
      to: email,
      subject: "Resend OTP",
      text: `Your new OTP is ${otp}. It is valid for 10 minutes.`,
    })
    res.status(200).json({
      message: "OTP resent successfully. Please check your email.",
    });

  } catch (error) {
    res.status(500).json({
      message: "Error resending OTP. Please try again later.",
    });
  }
}
