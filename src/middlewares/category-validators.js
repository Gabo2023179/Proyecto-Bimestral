import { body, param } from "express-validator";
import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { categoryExists, categoryNameExists, validateCategoryNameForUpdate } from "../helpers/db-validators.js";
import Category from "../category/category.model.js";

export const createCategoryValidator = [
  validateJWT,
  body("name").notEmpty().withMessage("El nombre de la categoría es obligatorio").trim().custom(categoryNameExists), // Valida que el nombre no esté repetido en la BD
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  body("createdBy").notEmpty().withMessage("El campo 'createdBy' es obligatorio").isMongoId().withMessage("El 'createdBy' debe ser un ID de MongoDB válido"),
  validarCampos,
  handleErrors,
];


export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista en la BD
  body("name").optional().trim().custom(validateCategoryNameForUpdate), // Se usa el helper para validar el nombre en actualizaciones
  body("description").optional().isString().withMessage("La descripción debe ser un texto válido").trim(),
  validarCampos,
  handleErrors,
];


export const getCategoryByIdValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista
  validarCampos,
  handleErrors,
];


export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("El ID proporcionado no es válido").custom(categoryExists), // Verifica que la categoría exista antes de eliminarla
  validarCampos,
  handleErrors,
];

export const createDefaultCategory = async (req, res) => {
  // Si res no está definido, asignar un objeto dummy para evitar el error
  res = res || { status: (code) => ({ json: (data) => data }) };

  try {
    // Verificar si ya existe una categoría por defecto
    const defaultCategory = await Category.findOne({ name: "default" });

    if (!defaultCategory) {
      // Si la categoría por defecto no existe, crear una nueva
      const newCategory = {
        name: "default",  // Nombre de la categoría por defecto
        description: "Categoría por defecto",  // Descripción de la categoría
        createdBy: "system",  // Quién crea la categoría, esto puede ser un ID de usuario si se desea
        status: true,  // Estado de la categoría, activada por defecto
      };

      // Crear la categoría
      const createdCategory = await Category.create(newCategory);

      return res.status(201).json({
        success: true,
        message: "Categoría por defecto creada",
        category: createdCategory,
      });
    } else {
      // Si la categoría por defecto ya existe
      return res.status(200).json({
        success: true,
        message: "La categoría por defecto ya existe",
        category: defaultCategory,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la categoría por defecto",
      error: error.message,
    });
  }
};
