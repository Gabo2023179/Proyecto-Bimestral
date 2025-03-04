import { Router } from "express";
import {getCategories, getCategoryById, createCategory, updateCategory, deleteCategory} from "../category/category.controller.js";
import {createCategoryValidator, updateCategoryValidator, deleteCategoryValidator, getCategoryByIdValidator} from "../middlewares/category-validators.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryByIdValidator, getCategoryById);
router.post("/", createCategoryValidator, createCategory);
router.put("/:id", updateCategoryValidator, updateCategory);
router.delete("/:id", deleteCategoryValidator, deleteCategory);

export default router;