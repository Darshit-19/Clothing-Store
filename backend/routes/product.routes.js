import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  addProductSchema,
  updateProductSchema,
} from "../validation/product.validation.js";

const router = express.Router();

//Add product
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(addProductSchema),
  addProduct
);

//Get all products
router.get("/", isAuthenticated, getProduct);

//Get product by id
router.get("/:id", isAuthenticated, getProductById);

//Update product
router.patch(
  "/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(updateProductSchema),
  updateProduct
);

//Delete product
router.delete("/:id", isAuthenticated, authorizeRoles("admin"), deleteProduct);

export default router;
