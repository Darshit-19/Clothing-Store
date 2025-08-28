import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", verifyToken,addProduct);

export default router;
