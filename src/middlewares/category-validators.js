import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
import { categoryExists, categoryNameExists, validateCategoryNameForUpdate } from "../helpers/db-validators.js";

/**
 * Validaciones para crear una categoría
 */
export const createCategoryValidator = [
  body("name").notEmpty().withMessage("El nombre de la categoría es obligatorio").trim().custom(categoryNameExists), // Valida que el nombre no esté repetido en la BD
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  body("createdBy").notEmpty().withMessage("El campo 'createdBy' es obligatorio").isMongoId().withMessage("El 'createdBy' debe ser un ID de MongoDB válido"),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para actualizar una categoría
 */
export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista en la BD
  body("name").optional().trim().custom(validateCategoryNameForUpdate), // Se usa el helper para validar el nombre en actualizaciones
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para obtener una categoría por su ID
 */
export const getCategoryByIdValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista
  validarCampos,
  handleErrors,
];

/**
 * Validaciones para eliminar una categoría por su ID
 */
export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista antes de eliminarla
  validarCampos,
  handleErrors,
];
