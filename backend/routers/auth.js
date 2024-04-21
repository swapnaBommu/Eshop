import express from "express";
import { registerUser,loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateProfile } from "../controllers/authControllers.js";
import { isAuthentictedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// localhost:4000/api/v1/register
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthentictedUser, getUserProfile);
router.route("/me/update").put(isAuthentictedUser, updateProfile);
router.route("/password/update").put(isAuthentictedUser,updatePassword);


export default router;