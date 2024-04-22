import express from "express";
import { createProductReview, deleteProduct, deleteReview, getProductDetails, getProductReviews, getProducts, newProduct, updateProduct } from "../controllers/productController.js";
import { isAuthentictedUser,authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductDetails);

router
    .route("/admin/products")
    .post(isAuthentictedUser,authorizeRoles('admin'),newProduct);
router
    .route("/admin/products/:id")
    .put(isAuthentictedUser,authorizeRoles('admin'), updateProduct);
router
    .route("/admin/products/:id")
    .delete(isAuthentictedUser,authorizeRoles('admin'), deleteProduct);

router
    .route("/reviews")
    .post (isAuthentictedUser,createProductReview)
    .get(isAuthentictedUser, getProductReviews);

router
    .route("/admin/reviews")
    .delete (isAuthentictedUser,authorizeRoles("admin"),deleteReview);
export default router;