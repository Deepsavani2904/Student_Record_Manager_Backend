const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const registerStudent = async (req, res) => {
  try {
    const { name, email, password, gender, phone, role } = req.body;

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      phone,
      role,
    });

    return res
      .status(201)
      .json({ success: true, message: "Student registered successfully!" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUser = await User.findOne({ email: email });

    if (!loginUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, loginUser.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      {
        id: loginUser._id,
        role: loginUser.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      })
      .json({
        success: true,
        token: token,
        data: { ...loginUser._doc, password: undefined },
        message: "User login successfully!",
      });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json({ success: true, message: "User logout successfully!" });
};

module.exports = {
  registerStudent,
  login,
  logout,
};
