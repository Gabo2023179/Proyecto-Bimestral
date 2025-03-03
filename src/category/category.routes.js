import { Router } from "express";
import {getCategories, getCategoryById, createCategory, updateCategory, deleteCategory} from "../category/category.controller.js";
import {createCategoryValidator, updateCategoryValidator, categoryIdValidator} from "../middlewares/category-validators.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", categoryIdValidator, getCategoryById);
router.post("/", createCategoryValidator, createCategory);
router.put("/:id", updateCategoryValidator, updateCategory);
router.delete("/:id", categoryIdValidator, deleteCategory);

export default router;