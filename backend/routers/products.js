import express from "express";
import { deleteProduct, getProductDetails, getProducts, newProduct, updateProduct } from "../controllers/productController.js";
import { isAuthentictedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(isAuthentictedUser,authorizeRoles('admin'),newProduct);

router.route("/products/:id").get(getProductDetails);
router.route("/admin/products/:id").put(isAuthentictedUser,authorizeRoles('admin'), updateProduct);
router.route("/admin/products/:id").delete(isAuthentictedUser,authorizeRoles('admin'), deleteProduct);

export default router;