import { Router } from "express";
import { getCart, addToCart, editCartItem, removeFromCart, clearCart } from "../cart/cart.controller.js";
import { createCartItemValidator, editCartItemValidator } from "../middlewares/cart-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Rutas para la gestión del carrito de compras
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 cart:
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
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: Producto 1
 *                               price:
 *                                 type: number
 *                                 example: 100
 *                           quantity:
 *                             type: number
 *                             example: 2
 *       500:
 *         description: Error al obtener el carrito
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
 *                   example: Error al obtener el carrito
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/", validateJWT, getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Agregar (crear) o sumar cantidad en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto
 *                 example: 60d0fe4f5311236168a109ca
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 example: 2
 *     responses:
 *       200:
 *         description: Producto agregado/actualizado en el carrito
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
 *                   example: Producto agregado/actualizado en el carrito
 *                 cart:
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
 *       500:
 *         description: Error al agregar/actualizar el carrito
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
 *                   example: Error al agregar/actualizar el carrito
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/", validateJWT, createCartItemValidator, addToCart);

/**
 * @swagger
 * /cart:
 *   put:
 *     summary: Editar (actualizar) la cantidad de un producto en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto
 *                 example: 60d0fe4f5311236168a109ca
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 example: 3
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
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
 *                   example: Carrito actualizado exitosamente
 *                 cart:
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
 *                             example: 3
 *       404:
 *         description: Carrito no encontrado o producto no se encuentra en el carrito
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
 *                   example: Carrito no encontrado
 *       500:
 *         description: Error al actualizar el carrito
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
 *                   example: Error al actualizar el carrito
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.put("/", validateJWT, editCartItemValidator, editCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Remover un producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: ID del producto
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Producto removido del carrito
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
 *                   example: Producto removido del carrito
 *                 cart:
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
 *       404:
 *         description: Carrito no encontrado
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
 *                   example: Carrito no encontrado
 *       500:
 *         description: Error al remover del carrito
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
 *                   example: Error al remover del carrito
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.delete("/", validateJWT, removeFromCart);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vaciar el carrito completo
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito vaciado
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
 *                   example: Carrito vaciado
 *                 cart:
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
 *       404:
 *         description: Carrito no encontrado
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
 *                   example: Carrito no encontrado
 *       500:
 *         description: Error al vaciar el carrito
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
 *                   example: Error al vaciar el carrito
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.delete("/clear", validateJWT, clearCart);

export default router;