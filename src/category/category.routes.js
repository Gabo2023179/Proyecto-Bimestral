import { Router } from "express";
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../category/category.controller.js";
import { createCategoryValidator, updateCategoryValidator, getCategoryByIdValidator, deleteCategoryValidator } from "../middlewares/category-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Rutas para la gestión de categorías
 */

/**
 * @swagger
 * /ventasOnline/v1/category:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Electrónica
 *                       description:
 *                         type: string
 *                         example: Productos electrónicos y gadgets
 *                       createdBy:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
 *                       status:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Error interno del servidor
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
 *                   example: Error al obtener las categorías
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/", getCategories);

/**
 * @swagger
 * /ventasOnline/v1/category/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Electrónica
 *                     description:
 *                       type: string
 *                       example: Productos electrónicos y gadgets
 *                     createdBy:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Categoría no encontrada
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
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al obtener la categoría
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
 *                   example: Error al obtener la categoría
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/:id", getCategoryByIdValidator, getCategoryById);

/**
 * @swagger
 * /ventasOnline/v1/category:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: Electrónica
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *                 example: Productos electrónicos y gadgets
 *               createdBy:
 *                 type: string
 *                 description: ID del usuario que crea la categoría
 *                 example: 60d0fe4f5311236168a109ca
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
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
 *                   example: Categoría creada exitosamente
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Electrónica
 *                     description:
 *                       type: string
 *                       example: Productos electrónicos y gadgets
 *                     createdBy:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Error al crear la categoría
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
 *                   example: Error al crear la categoría
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/", createCategoryValidator, createCategory);

/**
 * @swagger
 * /ventasOnline/v1/category/{id}:
 *   put:
 *     summary: Actualiza una categoría por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *                 example: Electrónica
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *                 example: Productos electrónicos y gadgets
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
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
 *                   example: Categoría actualizada exitosamente
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Electrónica
 *                     description:
 *                       type: string
 *                       example: Productos electrónicos y gadgets
 *                     createdBy:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     status:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Categoría no encontrada para actualizar
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
 *                   example: Categoría no encontrada para actualizar
 *       500:
 *         description: Error al actualizar la categoría
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
 *                   example: Error al actualizar la categoría
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.put("/:id", updateCategoryValidator, updateCategory);

/**
 * @swagger
 * /ventasOnline/v1/category/{id}:
 *   delete:
 *     summary: Elimina una categoría por ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada y productos reasignados
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
 *                   example: Categoría eliminada y productos reasignados
 *       404:
 *         description: Categoría no encontrada
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
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
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
 *                   example: Error al eliminar la categoría
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.delete("/:id", deleteCategoryValidator, deleteCategory);

export default router;