import { Router } from "express";
import { checkout } from "../checkout/checkout.controller.js";
import { checkoutValidator } from "../middlewares/checkout-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Rutas de gestión de compras (checkout)
 */

/**
 * @swagger
 * /ventasOnline/v1/checkout:
 *   post:
 *     summary: Procesa la compra (checkout)
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Compra realizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Compra realizada exitosamente
 *                 invoice:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: 60d0fe4f5311236168a109ca
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                           price:
 *                             type: number
 *                             example: 100
 *                     total:
 *                       type: number
 *                       example: 200
 *       400:
 *         description: El carrito está vacío
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El carrito está vacío
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Producto con ID {id} no encontrado
 *       500:
 *         description: Error en el proceso de compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error en el proceso de compra
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/", validateJWT, checkoutValidator, checkout);

export default router;