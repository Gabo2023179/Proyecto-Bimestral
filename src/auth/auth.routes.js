import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";

/**
 * Crea un nuevo enrutador de Express.
 * 
 * Este enrutador permite definir rutas para el registro e inicio de sesión de usuarios,
 * manteniendo la modularidad y organización del código.
 */
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
 *                 example: SecurePass123!
 *               role:
 *                 type: string
 *                 description: Rol del usuario (opcional)
 *                 example: CLIENT
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
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
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    "/register",  // Endpoint para el registro de usuario
    registerValidator, // Middleware de validación de datos
    register // Controlador que maneja el registro
);

/**
 * @swagger
 * /ventasOnline/v1/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
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
 *                 example: SecurePass123!
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    "/login",  // Endpoint para el inicio de sesión
    loginValidator, // Middleware de validación de datos de inicio de sesión
    login // Controlador que maneja la autenticación
);

export default router; // Exportamos el enrutador para su uso en la aplicación principal