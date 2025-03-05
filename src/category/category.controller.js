import Category from "../category/category.model.js";
import { reassignProductsToDefault, getDefaultCategoryId  } from "../helpers/db-validators.js";


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

    
    const defaultCategoryId = await getDefaultCategoryId();

    
    await reassignProductsToDefault(id, defaultCategoryId);

    
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
