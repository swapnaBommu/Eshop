import express from "express";
import { registerUser } from "../controllers/authControllers.js";

const router = express.Router();

// localhost:4000/api/v1/register
router.route("/register").post(registerUser);


export default router;