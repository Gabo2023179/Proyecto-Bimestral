import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rutas de autenticación
 */

/**
 * @swagger
 * /ventasOnline/v1/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: juan123
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: SecureP@ssword123
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User has been created
 *                 name:
 *                   type: string
 *                   example: Juan
 *                 email:
 *                   type: string
 *                   example: juan@example.com
 *       500:
 *         description: Error al registrar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registration failed
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/register", registerValidator, register);

/**
 * @swagger
 * /ventasOnline/v1/auth/login:
 *   post:
 *     summary: Inicia sesión un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: juan@example.com
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: juan123
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: SecureP@ssword123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 userDetails:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: jwt_token
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Crendenciales inválidas
 *                 error:
 *                   type: string
 *                   example: No existe el usuario o correo ingresado
 *       500:
 *         description: Error en el servidor al iniciar sesión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed, server error
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/login", loginValidator, login);

export default router;