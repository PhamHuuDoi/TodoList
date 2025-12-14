import express from "express";
import {
  register,
  login,
  forgotPassword,
  logout,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getMe } from "../controllers/authController.js";
const router = express.Router();
router.get("/me", protect, getMe);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
export default router;
