import express from "express";
const router = express.Router();

import { isAuthentictedUser } from "../middlewares/auth.js";
import {    stripeCheckoutSession } from "../controllers/paymentControllers.js";

router
  .route("/payment/checkout_session")
  .post(isAuthentictedUser, stripeCheckoutSession);

export default router;