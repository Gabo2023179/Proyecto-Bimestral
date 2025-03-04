import Category from "../models/category.model.js";
import { reassignProductsToDefault } from "../helpers/category.helpers.js";

// ID de la categoría predeterminada a la cual se reasignan los productos
const DEFAULT_CATEGORY_ID = "65f9c3f5d5e8b42f12345678";


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
