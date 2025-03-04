import Cart from "../cart/cart.model.js";
import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";
import { validateInvoiceStock } from "../helpers/db-validators.js";

/**
 * Proceso de compra (checkout):
 * - Obtiene el carrito del usuario autenticado.
 * - Valida el stock disponible para cada producto.
 * - Calcula el total, actualiza el stock y el número de vendidos en cada producto.
 * - Genera una factura y vacía el carrito.
 */
export const checkout = async (req, res) => {
  try {
    const userId = req.usuario._id; // Se obtiene desde el middleware JWT

    const cart = await Cart.findOne({ user: userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "El carrito está vacío"
        });
    }
    
    // Valida que cada producto tenga stock suficiente
    await validateInvoiceStock(cart.items);
    
    let total = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      total += product.price * item.quantity;
      
      // Actualiza el stock y la cantidad vendida
      product.stock -= item.quantity;
      product.sold = (product.sold || 0) + item.quantity;
      await product.save();
    }
    
    // Crea la factura con la información del carrito
    const invoice = new Invoice({ user: userId, items: cart.items, total });
    await invoice.save();
    
    // Vacía el carrito
    cart.items = [];
    await cart.save();
    
    return res.status(201).json({ 
      success: true, 
      message: "Compra realizada exitosamente", 
      invoice 
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error en el proceso de compra",
      error: err.message,
    });
  }
};
