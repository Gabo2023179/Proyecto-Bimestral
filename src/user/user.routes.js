import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, updateUserById, getUserPurchaseHistory } from "../user/user.controller.js";
import { registerValidator, loginValidator, getUserByIdValidator, deleteUserValidator, adminUpdateUserValidator, createUserValidator } from "../middlewares/user-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rutas de gestión de usuarios
 */

/**
 * @swagger
 * /ventasOnline/v1/user:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: number
 *                   example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Juan
 *                       surname:
 *                         type: string
 *                         example: Perez
 *                       username:
 *                         type: string
 *                         example: juan123
 *                       email:
 *                         type: string
 *                         example: juan@example.com
 *                       phone:
 *                         type: string
 *                         example: 12345678
 *                       role:
 *                         type: string
 *                         example: CLIENT
 *                       status:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getUsers);

/**
 * @swagger
 * /ventasOnline/v1/user/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     surname:
 *                       type: string
 *                       example: Perez
 *                     username:
 *                       type: string
 *                       example: juan123
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     phone:
 *                       type: string
 *                       example: 12345678
 *                     role:
 *                       type: string
 *                       example: CLIENT
 *                     status:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:uid", getUserByIdValidator, getUserById);

/**
 * @swagger
 * /ventasOnline/v1/user:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               surname:
 *                 type: string
 *                 example: Perez
 *               username:
 *                 type: string
 *                 example: juan123
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: SecureP@ssword123
 *               phone:
 *                 type: string
 *                 example: 12345678
 *               role:
 *                 type: string
 *                 example: CLIENT
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
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
 *                   example: Usuario creado exitosamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     surname:
 *                       type: string
 *                       example: Perez
 *                     username:
 *                       type: string
 *                       example: juan123
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     phone:
 *                       type: string
 *                       example: 12345678
 *                     role:
 *                       type: string
 *                       example: CLIENT
 *                     status:
 *                       type: boolean
 *                       example: true
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", createUserValidator, createUser);

/**
 * @swagger
 * /ventasOnline/v1/user/updateUser/{uid}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               surname:
 *                 type: string
 *                 example: Perez
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: Usuario actualizado exitosamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     surname:
 *                       type: string
 *                       example: Perez
 *                     username:
 *                       type: string
 *                       example: juan123
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     phone:
 *                       type: string
 *                       example: 12345678
 *                     role:
 *                       type: string
 *                       example: CLIENT
 *                     status:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.put("/updateUser/:uid", adminUpdateUserValidator, updateUserById);

/**
 * @swagger
 * /ventasOnline/v1/user/deleteUser:
 *   delete:
 *     summary: Elimina (desactiva) al usuario autenticado
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
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
 *                   example: Usuario eliminado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/deleteUser", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /ventasOnline/v1/user/purchase-history:
 *   get:
 *     summary: Obtiene el historial de compras del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de compras obtenido exitosamente
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
 *                   example: Historial de compras obtenido exitosamente
 *                 purchases:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: string
 *                               example: 60d0fe4f5311236168a109ca
 *                             quantity:
 *                               type: number
 *                               example: 2
 *                             price:
 *                               type: number
 *                               example: 100
 *                       total:
 *                         type: number
 *                         example: 200
 *                       status:
 *                         type: string
 *                         example: Pagada
 *                       createdAt:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *       404:
 *         description: No se encontraron compras para este usuario
 *       500:
 *         description: Error al obtener el historial de compras
 */
router.get("/purchase-history", validateJWT, getUserPurchaseHistory);

export default router;