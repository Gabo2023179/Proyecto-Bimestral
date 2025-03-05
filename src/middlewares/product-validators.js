import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
import { productNameExists, productExists } from "../helpers/db-validators.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js";
/**
 * Validaciones para crear un producto
 */
export const createProductValidator = [
  body("name").notEmpty().withMessage("El nombre del producto es obligatorio").trim().custom(productNameExists), // Verifica que el nombre no exista
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  body("price").notEmpty().withMessage("El precio es obligatorio").isNumeric().withMessage("El precio debe ser un número"),
  body("stock").notEmpty().withMessage("El stock es obligatorio").isInt({ min: 0 }).withMessage("El stock debe ser un entero no negativo"),
  body("category").notEmpty().withMessage("La categoría es obligatoria").isMongoId().withMessage("La categoría debe ser un ID de MongoDB válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para actualizar un producto
 */
export const updateProductValidator = [
  param("id").isMongoId().withMessage("El ID del producto no es válido").custom(productExists), // Verifica que el producto exista
  body("name").optional().trim().custom(productNameExists), // Verifica que el nombre no se repita
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  body("price").optional().isNumeric().withMessage("El precio debe ser un número"),
  body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un entero no negativo"),
  body("category").optional().isMongoId().withMessage("La categoría debe ser un ID de MongoDB válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para obtener un producto por su ID
 */
export const getProductByIdValidator = [
  param("id").isMongoId().withMessage("El ID del producto no es válido").custom(productExists), // Verifica que el producto exista
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para eliminar un producto por su ID
 */
export const deleteProductValidator = [
  param("id").isMongoId().withMessage("El ID del producto no es válido").custom(productExists), // Verifica que el producto exista
  validarCampos,
  handleErrors,
];

export const updateProductImageValidator = [
  param("id").isMongoId().withMessage("No es un ID válido de MongoDB"),
  param("id").custom(productExists),
  validarCampos,
  deleteFileOnError,
  handleErrors
];