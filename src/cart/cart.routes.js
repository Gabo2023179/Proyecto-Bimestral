import { Router } from "express";
import { getCart, addToCart, removeFromCart } from "../controllers/cart.controller.js";
import { createCartItemValidator } from "../middlewares/cart.validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", validateJWT, getCart);
router.post("/", validateJWT, createCartItemValidator, addToCart);
router.delete("/", validateJWT, removeFromCart);

export default router;
