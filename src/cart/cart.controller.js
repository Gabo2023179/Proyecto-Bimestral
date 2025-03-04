import Cart from "../models/cart.model.js";

/**
 * Obtiene el carrito del usuario autenticado.
 * Se asume que el middleware JWT agrega req.usuario con el _id del usuario.
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price");
    return res.status(200).json({ 
      success: true,
      cart 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Error al obtener el carrito",
      error: err.message 
    });
  }
};

/**
 * Agrega un producto al carrito del usuario.
 * Si el carrito no existe, se crea uno.
 * Si el producto ya está en el carrito, se actualiza la cantidad.
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { product, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Buscar si el producto ya existe en el carrito
    const index = cart.items.findIndex(item => item.product.toString() === product);
    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();

    return res.status(200).json({ 
      success: true, 
      message: "Producto agregado al carrito", 
      cart 
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Error al agregar al carrito", 
      error: err.message 
    });
  }
};

/**
 * Remueve un producto del carrito del usuario.
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { product } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Carrito no encontrado" 
      });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== product);
    await cart.save();

    return res.status(200).json({ 
      success: true,
      message: "Producto removido del carrito",
      cart 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Error al remover del carrito",
      error: err.message 
    });
  }
};

/**
 * Vacía el carrito del usuario.
 * (Endpoint adicional para limpiar el carrito completo)
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Carrito no encontrado" 
      });
    }
    cart.items = [];
    await cart.save();
    return res.status(200).json({ 
      success: true,
      message: "Carrito vaciado",
      cart 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: "Error al vaciar el carrito",
      error: err.message 
    });
  }
};
