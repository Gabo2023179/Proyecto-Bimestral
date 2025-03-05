import Cart from "../cart/cart.model.js";
import Invoice from "../invoice/invoice.model.js";
import Product from "../product/product.model.js";
import { validateInvoiceStock } from "../helpers/db-validators.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "El carrito está vacío"
      });
    }
    
    // Opcional: Validar stock para cada item
    await validateInvoiceStock(cart.items);
    
    let total = 0;
    const invoiceItems = [];
    
    // Procesar cada item del carrito para obtener el precio actual y actualizar stock y ventas
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Producto con ID ${item.product} no encontrado`
        });
      }
      
      const price = product.price; // Precio actual del producto
      total += price * item.quantity;
      
      // Actualizar el stock y las ventas del producto
      product.stock -= item.quantity;
      product.sold = (product.sold || 0) + item.quantity;
      await product.save();
      
      // Construir el objeto del ítem de factura con el campo "price"
      invoiceItems.push({
        product: item.product,
        quantity: item.quantity,
        price: price
      });
    }
    
    // Crear la factura con los items transformados y el total calculado
    const invoice = new Invoice({
      user: userId,
      items: invoiceItems,
      total: total
    });
    
    await invoice.save();
    
    // Vaciar el carrito
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
      error: err.message
    });
  }
};