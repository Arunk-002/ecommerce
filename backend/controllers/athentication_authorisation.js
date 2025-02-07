const User = require("../models/user");
require("dotenv").config();
const { createToken } = require("../service/auth");
const transporter = require("../service/nodeMailer");
const axios = require("axios");
async function userCreation(req, res) {
  try {
    const userData = req.body;
    console.log(userData);
    let userCheck = await User.findOne({ email: userData.email });
    if (userCheck) {
      throw new Error("email already exits");
    }
    const newUser = await User.create({
      name: capitalizeFirstLetter(userData.name),
      email: userData.email.toLowerCase(),
      password: userData.password,
    });
    const token = createToken({
      id: newUser.id,
      role: newUser.role,
    });
    res.cookie("idToken", token);
    if (newUser.id) {
      const msg = {
        msg: "user created",
        user: newUser,
        token: token,
      };
      return res.status(201).json(msg);
    } else {
      throw new Error(" unable to create user");
    }
  } catch (error) {
    console.log(error.message);
    if (error.message) {
      return res.status(400).json(error.message);
    }
    return res.status(400).json(error.message);
  }
}

async function userLogin(req, res) {
  try {
    const userData = req.body;
    const cur_user = await User.findOne({
      email: userData.email,
    });
    if (!cur_user) {
      throw new Error("user Deos not exist");
    }
    if (cur_user.password === userData.password.toLowerCase()) {
      const token = createToken({
        id: cur_user.id,
        role: cur_user.role,
      });

      const msg = {
        msg: "user exists",
        user: cur_user,
      };
      return res
        .status(201)
        .cookie("idToken", token, {
          httpOnly: true,
          secure: true, // Required for HTTPS
          sameSite: "none", // Required for cross-site cookies
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        })
        .json(msg);
    } else {
      throw new Error("Invalid User credentials");
    }
  } catch (err) {
    const msg = {
      msg: err.message,
    };
    return res.status(400).json(msg);
  }
}

function logout(req, res) {
  try {
    res.cookie('idToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0
  });
  res.status(201).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(error);
    
  }
}

function capitalizeFirstLetter(name) {
  if (typeof name !== "string" || name.length === 0) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function VerifyOtp(req, res) {
  const { otp } = req.body;
  if (!req.session.otp || !req.session.otpExpiry) {
    return res
      .status(400)
      .json({ success: false, message: "No OTP found. Request a new one." });
  }

  // Check if OTP is expired
  if (Date.now() > req.session.otpExpiry) {
    return res
      .status(400)
      .json({ success: false, message: "OTP expired. Request a new one." });
  }
  if (req.session.otp === otp) {
    // OTP is correct, clear session
    req.session.otp = null;
    req.session.otpExpiry = null;

    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP. Try again." });
  }
}

const sendEmail = async (req, res) => {
  const { to } = req.body;
  console.log(to);

  const otp = generateOTP();
  req.session.otp = otp;
  req.session.otpExpiry = Date.now() + 2 * 60 * 1000;
  try {
    await transporter.sendMail({
      from: process.env.NODE_USER,
      to,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    return res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, otp });
  }
};

function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  console.log(OTP);
  return OTP;
}

async function emailValidator(req, res) {
  const { email } = req.body;
  try {
    const api_key = process.env.EMAIL_VALIDATOR_KEY;
    if (!api_key) {
      return res
        .status(500)
        .json({ success: false, message: "API key is missing." });
    }

    // Await Axios Request
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${api_key}&email=${email}`
    );

    // Extract relevant data
    const { deliverability, is_valid_format } = response.data;
    console.log(deliverability, is_valid_format);

    if (deliverability === "DELIVERABLE" && is_valid_format?.value === true) {
      return res.status(200).json({
        success: true,
        message: "Email is valid and can be used for registration.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email is invalid or not reliable.",
      });
    }
  } catch (error) {
    console.error("Error validating email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Email validation failed. Please try again later.",
    });
  }
}

module.exports = emailValidator;

module.exports = {
  userCreation,
  userLogin,
  logout,
  sendEmail,
  VerifyOtp,
  emailValidator,
};
