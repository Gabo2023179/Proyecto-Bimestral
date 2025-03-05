import Product from "../product/product.model.js";
import fs from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
/**
 * Obtiene el catálogo completo de productos.
 * Si se reciben query params, se realizan búsquedas o filtrados:
 * - ?name=... => búsqueda por nombre (parcial, case-insensitive)
 * - ?category=... => filtrado por categoría (se asume que es el ID de la categoría)
 */
export const getProducts = async (req, res) => {
  try {
    const { name, category } = req.query;
    
    // Búsqueda por nombre
    if (name) {
      const products = await Product.find({ name: { $regex: name, $options: "i" } })
        .populate("category", "name");

      return res.status(200).json({ 
        success: true,
        products 
      });
    }
    
    // Filtrado por categoría
    if (category) {
      const products = await Product.find({ category })
        .populate("category", "name");

      return res.status(200).json({ 
        success: true, 
        products 
      });
    }
    
    // Catálogo completo
    const products = await Product.find().populate("category", "name");

    return res.status(200).json({ 
      success: true,
      products 
    });
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: err.message,
    });
  }
};

/**
 * Obtiene un producto por su ID.
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }
    return res.status(200).json({ 
      success: true,
      product
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: err.message,
    });
  }
};

/**
 * Crea un nuevo producto.
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = new Product({ name, description, price, stock, category });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al crear el producto",
      error: err.message,
    });
  }
};

/**
 * Actualiza un producto existente.
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado para actualizar",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el producto",
      error: err.message,
    });
  }
};

/**
 * Elimina un producto.
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado para eliminar",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error: err.message,
    });
  }
};

/**
 * Obtiene los productos agotados (stock igual a 0).
 */
export const getOutOfStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: 0 });

    return res.status(200).json({ success: true, products });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener productos agotados",
      error: err.message,
    });
  }
};

/**
 * Obtiene los productos más vendidos.
 * Se ordenan de forma descendente por el campo "sold" y se limitan a los 5 primeros.
 */
export const getBestSellingProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(5);

    return res.status(200).json({ 
      success: true,
      products 
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener los productos más vendidos",
      error: err.message,
    });
  }
};

export const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params; // Se espera que el parámetro se llame 'pid'
    const newProductImage = req.file ? req.file.filename : null;

    if (!newProductImage) {
      return res.status(400).json({
        success: false,
        msg: 'No se proporcionó una nueva imagen para el producto',
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: 'Producto no encontrado',
      });
    }

    // Si ya existe al menos una imagen para el producto, eliminar la principal (primer elemento)
    if (product.images && product.images.length > 0) {
      const oldProductImage = product.images[0];
      const oldProductImagePath = join(__dirname, "../../public/uploads/product-images", oldProductImage);
      try {
        await fs.unlink(oldProductImagePath);
      } catch (unlinkErr) {
        console.log(`Error al eliminar la imagen antigua: ${unlinkErr}`);
      }
      // Remover la imagen antigua del arreglo
      product.images.shift();
    }

    // Se añade la nueva imagen al inicio del arreglo (como imagen principal)
    product.images.unshift(newProductImage);
    await product.save();

    return res.status(200).json({
      success: true,
      msg: 'Imagen del producto actualizada',
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: 'Error al actualizar la imagen del producto',
      error: err.message,
    });
  }
};
