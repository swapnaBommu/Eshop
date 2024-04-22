import express from "express";
import { getOrderDetails, myorders, newOrder } from "../controllers/orderControllers.js";
import { isAuthentictedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();


router.route("/orders/new").post(isAuthentictedUser,newOrder);
router.route("/orders/:id").get(isAuthentictedUser,getOrderDetails);
router.route("/me/orders").get(isAuthentictedUser,myorders);


export default router;