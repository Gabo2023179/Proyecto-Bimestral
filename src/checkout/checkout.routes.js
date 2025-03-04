import { Router } from "express";
import { checkout } from "../checkout/checkout.controller.js";
import { checkoutValidator } from "../middlewares/checkout-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

// Endpoint para procesar la compra (checkout)
router.post("/", validateJWT, checkoutValidator, checkout);

export default router;
