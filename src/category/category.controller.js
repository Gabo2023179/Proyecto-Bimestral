import Category from "../models/category.model.js";
import { reassignProductsToDefault } from "../helpers/category.helpers.js";

// ID de la categoría predeterminada a la cual se reasignan los productos
const DEFAULT_CATEGORY_ID = "65f9c3f5d5e8b42f12345678";

/**
 * Obtiene todas las categorías existentes.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<object>} JSON con la lista de categorías.
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: err.message,
    });
  }
};

/**
 * Obtiene una categoría específica por su ID.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID de la categoría.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<object>} JSON con la categoría encontrada o un error.
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener la categoría",
      error: err.message,
    });
  }
};

/**
 * Crea una nueva categoría.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.body - Datos para crear la categoría.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<object>} JSON con la categoría creada.
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const category = new Category({ name, description, createdBy });
    await category.save();
    return res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      error: err.message,
    });
  }
};

/**
 * Actualiza la información de una categoría existente.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID de la categoría a actualizar.
 * @param {object} req.body - Datos a actualizar.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<object>} JSON con la categoría actualizada.
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada para actualizar",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category: updatedCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: err.message,
    });
  }
};

/**
 * Elimina una categoría y reasigna automáticamente los productos asociados a la categoría predeterminada.
 *
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} req.params - Parámetros de la URL.
 * @param {string} req.params.id - ID de la categoría a eliminar.
 * @param {object} res - Objeto de respuesta Express.
 * @returns {Promise<object>} JSON confirmando la eliminación y reasignación.
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    // Reasigna los productos asociados a esta categoría a la categoría predeterminada
    await reassignProductsToDefault(id, DEFAULT_CATEGORY_ID);

    // Elimina la categoría
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Categoría eliminada y productos reasignados",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: err.message,
    });
  }
};
