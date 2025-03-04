import { Router } from "express";
import {getProducts, getProductById, createProduct, updateProduct, deleteProduct, getOutOfStockProducts, getBestSellingProducts} from "../product/product.controller.js";
import {createProductValidator, updateProductValidator, getProductByIdValidator, deleteProductValidator} from "../middlewares/product-validators.js";

const router = Router();

router.get("/", getProducts);
router.get("/out-of-stock", getOutOfStockProducts);
router.get("/best-selling", getBestSellingProducts);
router.get("/:id", getProductByIdValidator, getProductById);
router.post("/", createProductValidator, createProduct);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);

export default router;