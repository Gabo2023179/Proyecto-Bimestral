import User from "../user/user.model.js"
import Category from "../category/category.model.js"
import Product from "../product/product.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


export const emailExists = async (email = "") => {
    const existe = await User.findOne({email})
    if(existe){
        throw new Error(`The email ${email} is already registered`)
    }  
}




export const usernameExists = async (username = "") => {
    const existe = await User.findOne({username})
    if(existe){
        throw new Error(`The username ${username} is already registered`)
    }
}


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
  
  
  export const categoryExists = async (id = "") => {
    const exists = await Category.findById(id);
    if (!exists) {
      throw new Error("No existe la categoría con el ID proporcionado");
    }
    return true;
  };
  
 
  export const validateCategoryNameForUpdate = async (name, { req }) => {
    if (!name) return true; // Si no se envía un nuevo nombre, no validamos
    await categoryNameExists(name); // Verifica que el nuevo nombre no exista en la BD
    return true;
  };
  
  
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
      // Crear documento PDF con margen
      const doc = new PDFDocument({ margin: 50 });
      const filePath = path.join(process.cwd(), "temp", `invoice_${invoice._id}.pdf`);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- Encabezado ---
      doc
        .fontSize(26)
        .fillColor("#333")
        .text("Factura", { align: "center" })
        .moveDown();

      // --- Información de la factura ---
      doc
        .fontSize(12)
        .fillColor("#555")
        .text(`Factura ID: ${invoice._id}`)
        .text(`Fecha: ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleString() : "N/A"}`)
        .moveDown();

      // --- Información del cliente ---
      const clientName = invoice.user && invoice.user.name ? invoice.user.name : "N/A";
      const clientEmail = invoice.user && invoice.user.email ? invoice.user.email : "N/A";
      doc
        .text(`Cliente: ${clientName}`)
        .text(`Email: ${clientEmail}`)
        .moveDown();

      // --- Línea divisoria ---
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.5);

      // --- Encabezado de Productos ---
      doc
        .fontSize(14)
        .fillColor("#000")
        .text("Detalle de Productos", { underline: true, align: "left" })
        .moveDown(0.5);

      // --- Listado de productos ---
      invoice.items.forEach((item, index) => {
        const productName = item.product && item.product.name ? item.product.name : "Producto no disponible";
        const quantity = item.quantity || 0;
        const unitPrice = item.price || 0;
        const totalItem = quantity * unitPrice;
        doc
          .fontSize(12)
          .fillColor("#333")
          .text(`${index + 1}. ${productName}`, { continued: true })
          .text(` | Cant: ${quantity}`, { continued: true })
          .text(` | Precio: $${unitPrice}`, { continued: true })
          .text(` | Total: $${totalItem}`)
          .moveDown(0.3);
      });

      // --- Línea divisoria antes del Total ---
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown(0.5);

      // --- Total de la factura ---
      doc
        .fontSize(14)
        .fillColor("#000")
        .text(`Total: $${invoice.total}`, { align: "right" })
        .moveDown();

      // --- Pie de Página ---
      doc
        .fontSize(10)
        .fillColor("#777")
        .text("¡Gracias por su compra!", { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};