import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
import { validateInvoiceStock } from "../helpers/db-validators.js";

/**
 * Validaciones para crear una factura.
 */
export const createInvoiceValidator = [
  body("user").notEmpty().withMessage("El usuario es obligatorio").isMongoId().withMessage("El usuario debe ser un ID de MongoDB válido"),
  body("items").isArray({ min: 1 }).withMessage("Debe haber al menos un producto en la factura").custom(validateInvoiceStock), // Valida el stock de cada producto
  body("total").notEmpty().withMessage("El total es obligatorio").isNumeric().withMessage("El total debe ser un número"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para actualizar una factura.
 */
export const updateInvoiceValidator = [
  param("id").isMongoId().withMessage("El ID de la factura no es válido"),
  body("items").optional().isArray({ min: 1 }).withMessage("Si se actualizan los productos, debe haber al menos uno").custom(validateInvoiceStock),
  body("total").optional().isNumeric().withMessage("El total debe ser un número"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para obtener una factura por su ID.
 */
export const getInvoiceByIdValidator = [
  param("id").isMongoId().withMessage("El ID de la factura no es válido"),
  validarCampos,
  handleErrors,
];
