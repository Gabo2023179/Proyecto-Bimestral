import { Router } from 'express';
import { getUserById, getUsers, deleteUser, updateUser } from "../user/user.controller.js";
import { getUserByIdValidator } from "../middlewares/user-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rutas de gestión de usuarios
 */

/**
 * @swagger
 * /ventasOnline/v1/user/findUser/{uid}:
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
 *                     uid:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
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
router.get("/findUser/:uid", getUserByIdValidator, getUserById);

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
 *                   type: integer
 *                   example: 1
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
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
 * /ventasOnline/v1/user/updateUser:
 *   put:
 *     summary: Actualiza la información del usuario autenticado
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
 *                     uid:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
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
router.put("/updateUser", validateJWT, validarCampos, handleErrors, updateUser);

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
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/deleteUser", validateJWT, validarCampos, handleErrors, deleteUser);

export default router;