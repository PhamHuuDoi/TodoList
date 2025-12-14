import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};
/* ===== REGISTER ===== */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email đã tồn tại" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });

  res.json({ message: "Đăng ký thành công" });
};

/* ===== LOGIN (COOKIE 24H) ===== */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Sai thông tin đăng nhập" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", //  CHẠY LOCALHOST
    secure: false,
    path: "/",
    domain: "localhost", // localhost không HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24h
  });
  console.log("SET COOKIE TOKEN:", token);
  res.json({
    message: "Đăng nhập thành công",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

/* ===== LOGOUT ===== */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.json({ message: "Đã đăng xuất" });
};

/* ===== FORGOT PASSWORD ===== */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.json({ message: "Nếu email tồn tại, hệ thống sẽ gửi link" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset mật khẩu",
      `Bấm link để đổi mật khẩu: ${resetUrl}`
    );

    res.json({ message: "Đã gửi email reset" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Không gửi được email" });
  }
};

/* ===== RESET PASSWORD ===== */
export const resetPassword = async (req, res) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Token không hợp lệ hoặc hết hạn" });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Đổi mật khẩu thành công" });
};
