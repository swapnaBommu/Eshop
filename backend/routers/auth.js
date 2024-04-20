import express from "express";
import { registerUser,loginUser, logout, forgotPassword } from "../controllers/authControllers.js";

const router = express.Router();

// localhost:4000/api/v1/register
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);


export default router;