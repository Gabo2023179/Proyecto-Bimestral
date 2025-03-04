import { Router } from "express";
import { getCart, addToCart, removeFromCart, clearCart } from "../controllers/cart.controller.js";
import { createCartItemValidator } from "../middlewares/cart.validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", validateJWT, getCart);
router.post("/", validateJWT, createCartItemValidator, addToCart);
router.delete("/", validateJWT, removeFromCart);
// Endpoint adicional para vaciar el carrito
router.delete("/clear", validateJWT, clearCart);

export default router;