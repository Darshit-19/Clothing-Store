import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import { addProduct, getProduct, getProductById } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addProductSchema } from "../validation/product.validation.js";

const router = express.Router();

router.post(
  "/products",
  isAuthenticated,
  authorizeRoles("admin"),
  validate(addProductSchema),
  addProduct
);
router.get("/products", isAuthenticated, getProduct);
router.get('/products/:id' , isAuthenticated , getProductById)

export default router;
