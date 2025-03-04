import User from "../user/user.model.js"
import Category from "../category/category.model.js"
import Product from "../models/product.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/**
 * Verifica si un email ya está registrado en la base de datos.
 * @param {string} email - Dirección de correo electrónico a verificar.
 * @throws {Error} Si el email ya está registrado.
 */
export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }  
}


/**
 * Verifica si un nombre de usuario ya está registrado en la base de datos.
 * @param {string} username - Nombre de usuario a verificar.
 * @throws {Error} Si el nombre de usuario ya está registrado.
 */

export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}

/**
 * Verifica si un usuario con un ID específico existe en la base de datos.
 * @param {string} uid - ID del usuario a verificar.
 * @throws {Error} Si el usuario no existe.
 */
export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}

export const validateUserNotDeleted = async (_, { req }) => {
    const uid = req.usuario._id; // Obtiene el ID del usuario desde req.usuario
    
    const user = await User.findById(uid); // Busca el usuario en la base de datos

    if (!user) {
        throw new Error("Usuario no encontrado"); // Si el usuario no existe, lanza un error
    }
    return true; // Si el usuario está activo, la validación pasa
};

/**
 * Verifica si el nombre de la categoría ya está registrado en la base de datos.
 * @param {string} name - Nombre de la categoría a verificar.
 * @throws {Error} Si la categoría ya existe.
 */
export const categoryNameExists = async (name = "") => {
    const exists = await Category.findOne({ name });
    if (exists) {
      throw new Error(`La categoría ${name} ya existe`);
    }
  };
  
  /**
   * Verifica si una categoría con un ID específico existe en la base de datos.
   * @param {string} id - ID de la categoría a verificar.
   * @throws {Error} Si la categoría no existe.
   */
  export const categoryExists = async (id = "") => {
    const exists = await Category.findById(id);
    if (!exists) {
      throw new Error("No existe la categoría con el ID proporcionado");
    }
    return true;
  };
  
  /**
   * Valida el nombre de una categoría en una actualización.
   * - Si el nombre no se envía, no realiza ninguna validación.
   * - Si el nombre se envía, verifica que no exista en otra categoría.
   * 
   * @param {string} name - Nuevo nombre de la categoría.
   * @param {object} req - Objeto de la solicitud Express.
   * @throws {Error} Si la categoría ya existe con ese nombre.
   */
  export const validateCategoryNameForUpdate = async (name, { req }) => {
    if (!name) return true; // Si no se envía un nuevo nombre, no validamos
    await categoryNameExists(name); // Verifica que el nuevo nombre no exista en la BD
    return true;
  };
  
  /**
   * Reasigna los productos asociados a una categoría eliminada a la categoría predeterminada.
   * @param {string} categoryId - ID de la categoría que se eliminará.
   * @param {string} defaultCategoryId - ID de la categoría predeterminada.
   * @returns {Promise} Resultado de la operación de actualización en los productos.
   */
  export const reassignProductsToDefault = async (categoryId, defaultCategoryId) => {
    return await Product.updateMany({ category: categoryId }, { category: defaultCategoryId });
  };


  /**
 * Verifica si el nombre del producto ya está registrado en la base de datos.
 * @param {string} name - Nombre del producto a verificar.
 * @throws {Error} Si el producto ya existe.
 */
export const productNameExists = async (name = "") => {
    const exists = await Product.findOne({ name });
    if (exists) {
      throw new Error(`El producto ${name} ya existe`);
    }
  };
  
  /**
   * Verifica si un producto con un ID específico existe en la base de datos.
   * @param {string} id - ID del producto a verificar.
   * @throws {Error} Si el producto no existe.
   */
  export const productExists = async (id = "") => {
    const exists = await Product.findById(id);
    if (!exists) {
      throw new Error("No existe el producto con el ID proporcionado");
    }
    return true;
  };

  /**
 * Valida el stock disponible para cada producto en la factura.
 * @param {Array} items - Arreglo de items (cada uno con { product, quantity, price }).
 * @throws {Error} Si algún producto no tiene stock suficiente.
 */
export const validateInvoiceStock = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Producto con ID ${item.product} no encontrado`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Stock insuficiente para el producto ${product.name}`);
    }
  }
  return true;
};

/**
 * Genera un PDF de la factura usando PDFKit y lo guarda temporalmente.
 * @param {Object} invoice - Objeto de la factura.
 * @returns {Promise<string>} Ruta del archivo PDF generado.
 */
export const generateInvoicePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filePath = path.join(process.cwd(), "temp", `invoice_${invoice._id}.pdf`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Encabezado
      doc.fontSize(20).text("Factura", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`ID: ${invoice._id}`);
      doc.text(`Usuario: ${invoice.user}`);
      doc.text(`Fecha: ${invoice.createdAt}`);
      doc.moveDown();

      // Lista de productos
      doc.text("Productos:");
      invoice.items.forEach((item, index) => {
        doc.text(`${index + 1}. Producto ID: ${item.product} | Cantidad: ${item.quantity} | Precio: ${item.price}`);
      });
      doc.moveDown();
      doc.text(`Total: ${invoice.total}`);
      doc.text(`Estado: ${invoice.status}`);
      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};