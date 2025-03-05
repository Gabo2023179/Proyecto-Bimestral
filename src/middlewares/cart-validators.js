import { body } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
// Supongamos que en nuestros helpers ya existe "productExists" para validar la existencia del producto
import { productExists } from "../helpers/db-validators.js";

export const createCartItemValidator = [
  body("product").notEmpty().withMessage("El ID del producto es obligatorio").isMongoId().withMessage("Debe ser un ID de MongoDB válido").custom(productExists), // Lógica asíncrona en el helper
  body("quantity").notEmpty().withMessage("La cantidad es obligatoria").isInt({ min: 1 }).withMessage("La cantidad debe ser al menos 1"),
  validarCampos,
  handleErrors
];

export const editCartItemValidator = [
  body("product")
    .notEmpty().withMessage("El ID del producto es obligatorio")
    .isMongoId().withMessage("Debe ser un ID de MongoDB válido")
    .custom(productExists),
  body("quantity")
    .notEmpty().withMessage("La cantidad es obligatoria")
    .isInt({ min: 1 }).withMessage("La cantidad debe ser al menos 1"),
  validarCampos,
  handleErrors
];
