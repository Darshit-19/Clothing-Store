import express from "express";
import {
  addToCart,
  deleteCart,
  updateCart,
  viewCart,
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Add product to the cart
router.post("/add", isAuthenticated, addToCart);

// View cart
router.get("/view", isAuthenticated, viewCart);

//Update the cart
router.patch("/update", isAuthenticated, updateCart);

//Delete product from cart
router.delete("/delete", isAuthenticated, deleteCart);

export default router;
