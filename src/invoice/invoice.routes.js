import { Router } from "express";
import { getInvoices, getInvoiceById, createInvoice, updateInvoice, downloadInvoicePDF } from "../invoice/invoice.controller.js";
import { createInvoiceValidator, updateInvoiceValidator, getInvoiceByIdValidator } from "../middlewares/invoice-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Invoice
 *   description: Rutas de gestión de facturas
 */

/**
 * @swagger
 * /ventasOnline/v1/invoice:
 *   get:
 *     summary: Obtiene todas las facturas
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: Lista de facturas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 invoices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109ca
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
 *       500:
 *         description: Error al obtener las facturas
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
 *                   example: Error al obtener las facturas
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/", getInvoices);

/**
 * @swagger
 * /ventasOnline/v1/invoice/{id}:
 *   get:
 *     summary: Obtiene una factura por ID
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                     status:
 *                       type: string
 *                       example: Pagada
 *       404:
 *         description: Factura no encontrada
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
 *                   example: Factura no encontrada
 *       500:
 *         description: Error al obtener la factura
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
 *                   example: Error al obtener la factura
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/:id", getInvoiceByIdValidator, getInvoiceById);

/**
 * @swagger
 * /ventasOnline/v1/invoice:
 *   post:
 *     summary: Crea una nueva factura
 *     tags: [Invoice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID del usuario
 *                 example: 60d0fe4f5311236168a109ca
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto
 *                       example: 60d0fe4f5311236168a109ca
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: Precio del producto
 *                       example: 100
 *               total:
 *                 type: number
 *                 description: Total de la factura
 *                 example: 200
 *     responses:
 *       201:
 *         description: Factura creada exitosamente
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
 *                   example: Factura creada exitosamente
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
 *                     status:
 *                       type: string
 *                       example: Pagada
 *       500:
 *         description: Error al crear la factura
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
 *                   example: Error al crear la factura
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/", createInvoiceValidator, createInvoice);

/**
 * @swagger
 * /ventasOnline/v1/invoice/{id}:
 *   put:
 *     summary: Actualiza una factura por ID
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto
 *                       example: 60d0fe4f5311236168a109ca
 *                     quantity:
 *                       type: number
 *                       description: Cantidad del producto
 *                       example: 2
 *                     price:
 *                       type: number
 *                       description: Precio del producto
 *                       example: 100
 *               total:
 *                 type: number
 *                 description: Total de la factura
 *                 example: 200
 *     responses:
 *       200:
 *         description: Factura actualizada exitosamente
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
 *                   example: Factura actualizada exitosamente
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
 *                     status:
 *                       type: string
 *                       example: Pagada
 *       404:
 *         description: Factura no encontrada para actualizar
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
 *                   example: Factura no encontrada para actualizar
 *       500:
 *         description: Error al actualizar la factura
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
 *                   example: Error al actualizar la factura
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.put("/:id", updateInvoiceValidator, updateInvoice);

/**
 * @swagger
 * /ventasOnline/v1/invoice/{id}/download:
 *   get:
 *     summary: Descarga una factura en formato PDF
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID de la factura
 *     responses:
 *       200:
 *         description: PDF de la factura descargado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Factura no encontrada
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
 *                   example: Factura no encontrada
 *       500:
 *         description: Error al generar el PDF
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
 *                   example: Error al generar el PDF
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.get("/:id/download", getInvoiceByIdValidator, downloadInvoicePDF);

export default router;