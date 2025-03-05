import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getOutOfStockProducts, getBestSellingProducts, updateProductImage } from "../product/product.controller.js";
import { createProductValidator, updateProductValidator, getProductByIdValidator, deleteProductValidator, updateProductImageValidator } from "../middlewares/product-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Rutas de gestión de productos
 */

/**
 * @swagger
 * /ventasOnline/v1/product:
 *   get:
 *     summary: Obtiene todos los productos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Producto 1
 *                       description:
 *                         type: string
 *                         example: Descripción del producto 1
 *                       price:
 *                         type: number
 *                         example: 100
 *                       stock:
 *                         type: number
 *                         example: 10
 *                       sold:
 *                         type: number
 *                         example: 5
 *                       category:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: image1.jpg
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getProducts);

/**
 * @swagger
 * /ventasOnline/v1/product/out-of-stock:
 *   get:
 *     summary: Obtiene los productos agotados
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de productos agotados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Producto 1
 *                       description:
 *                         type: string
 *                         example: Descripción del producto 1
 *                       price:
 *                         type: number
 *                         example: 100
 *                       stock:
 *                         type: number
 *                         example: 0
 *                       sold:
 *                         type: number
 *                         example: 5
 *                       category:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: image1.jpg
 *       500:
 *         description: Error interno del servidor
 */
router.get("/out-of-stock", getOutOfStockProducts);

/**
 * @swagger
 * /ventasOnline/v1/product/best-selling:
 *   get:
 *     summary: Obtiene los productos más vendidos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de productos más vendidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Producto 1
 *                       description:
 *                         type: string
 *                         example: Descripción del producto 1
 *                       price:
 *                         type: number
 *                         example: 100
 *                       stock:
 *                         type: number
 *                         example: 10
 *                       sold:
 *                         type: number
 *                         example: 50
 *                       category:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: image1.jpg
 *       500:
 *         description: Error interno del servidor
 */
router.get("/best-selling", getBestSellingProducts);

/**
 * @swagger
 * /ventasOnline/v1/product/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Producto 1
 *                     description:
 *                       type: string
 *                       example: Descripción del producto 1
 *                     price:
 *                       type: number
 *                       example: 100
 *                     stock:
 *                       type: number
 *                       example: 10
 *                     sold:
 *                       type: number
 *                       example: 5
 *                     category:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: image1.jpg
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", getProductByIdValidator, getProductById);

/**
 * @swagger
 * /ventasOnline/v1/product:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Producto 1
 *               description:
 *                 type: string
 *                 example: Descripción del producto 1
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
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
 *                   example: Producto creado exitosamente
 *                 product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Producto 1
 *                     description:
 *                       type: string
 *                       example: Descripción del producto 1
 *                     price:
 *                       type: number
 *                       example: 100
 *                     stock:
 *                       type: number
 *                       example: 10
 *                     sold:
 *                       type: number
 *                       example: 5
 *                     category:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: image1.jpg
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createProductValidator, createProduct);

/**
 * @swagger
 * /ventasOnline/v1/product/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Producto 1
 *               description:
 *                 type: string
 *                 example: Descripción del producto 1
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
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
 *                   example: Producto actualizado exitosamente
 *                 product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Producto 1
 *                     description:
 *                       type: string
 *                       example: Descripción del producto 1
 *                     price:
 *                       type: number
 *                       example: 100
 *                     stock:
 *                       type: number
 *                       example: 10
 *                     sold:
 *                       type: number
 *                       example: 5
 *                     category:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: image1.jpg
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", updateProductValidator, updateProduct);

/**
 * @swagger
 * /ventasOnline/v1/product/{id}:
 *   delete:
 *     summary: Elimina un producto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
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
 *                   example: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", deleteProductValidator, deleteProduct);

/**
 * @swagger
 * /ventasOnline/v1/product/{id}/image:
 *   patch:
 *     summary: Actualiza la imagen de un producto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen del producto actualizada
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
 *                   example: Imagen del producto actualizada
 *                 product:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Producto 1
 *                     description:
 *                       type: string
 *                       example: Descripción del producto 1
 *                     price:
 *                       type: number
 *                       example: 100
 *                     stock:
 *                       type: number
 *                       example: 10
 *                     sold:
 *                       type: number
 *                       example: 5
 *                     category:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: image1.jpg
 *       400:
 *         description: No se proporcionó una nueva imagen para el producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id/image",
     validateJWT,
     uploadProfilePicture.single("image"),
     updateProductImageValidator,
     updateProductImage);

export default router;