import express from "express";
import { newOrder } from "../controllers/orderControllers.js";
import { isAuthentictedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();


router.route("/orders/new").post(isAuthentictedUser,newOrder);

// router.route("/products/:id").get(getProductDetails);
// router.route("/admin/products/:id").put(isAuthentictedUser,authorizeRoles('admin'), updateProduct);
// router.route("/admin/products/:id").delete(isAuthentictedUser,authorizeRoles('admin'), deleteProduct);

export default router;