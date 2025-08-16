import bcrypt from "bcryptjs"; // bcrypt module for hashing passwords
import jwt from "jsonwebtoken"; // JWT module for token generation and verification
import User from "../models/userModel.js"; // User model for database operations
import transporter from "../config/nodemailer.js"; // Nodemailer transporter for sending emails

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
  const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Mohammeds Auth System",
      text: "Hey User, welcome to Mohammeds Auth System! Your account has been created successfully.",
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      return res.json({ success: false, message: error.message });
    }
    //

    return res.json({
      success: true,
      message: "User Created Successfully",
      user: username,
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Login Successful",
      user,
      token,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Logout a user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
    });

    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify OTP function (to be implemented)
export const sendverifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const otp = String(Math.floor(Math.random() * 900000 + 100000)); // Generate a random 6-digit OTP

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    // Fetch user again to confirm OTP is saved
    const updatedUser = await User.findById(user._id);
    console.log("OTP set and saved in DB:", updatedUser.verifyOtp);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Account",
      text: `Your verification OTP is ${otp}. It is valid for 24 hours.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify Email using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Debug log for OTP comparison
    console.log("Stored OTP:", user.verifyOtp, "Input OTP:", otp);

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const passResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if(!user.isVerified) {
      return res.json({ success: false, message: "User not verified" });  
    }
    if (user.isVerified) {
      const otp = String(Math.floor(Math.random() * 900000 + 100000)); // Generate a random 6-digit OTP
      user.resetOtp = otp;
      user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      await user.save();

      // Send welcome email
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Reset Your Password",
        text: `Your OTP is ${otp}. It is valid for 24 hours.`,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
      } catch (error) {
        console.error("Error sending email:", error);
        return res.json({ success: false, message: error.message });
      }
      //
    }
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const passResetVerifyOTP = async (req, res) => {
  const { email , otp , newPassword} = req.body;

  if(!email || !otp || !newPassword){ 
    return res.json({ success: false, message: "Invalid Credentails" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.json({ success: false, message: "User not found" });

    if(user.resetOtp === '' || user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });
    
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password= hashedPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;
      await user.save();

      res.json({ success: true, message: "Password reset successfully" });

    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

