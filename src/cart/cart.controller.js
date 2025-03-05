import Cart from "../cart/cart.model.js";

/**
 * Obtiene el carrito del usuario autenticado.
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
 * Agrega (o actualiza) un producto en el carrito del usuario autenticado.
 * Si el carrito no existe, se crea uno.
 * Si el producto ya existe en el carrito, se actualiza la cantidad (se suma la cantidad nueva).
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
      // Actualizamos la cantidad sumándole la nueva cantidad
      cart.items[index].quantity += quantity;
    } else {
      // Se agrega un nuevo item
      cart.items.push({ product, quantity });
    }

    await cart.save();

    return res.status(200).json({ 
      success: true, 
      message: "Producto agregado/actualizado en el carrito", 
      cart 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Error al agregar/actualizar el carrito", 
      error: err.message 
    });
  }
};

/**
 * Edita (actualiza) la cantidad de un producto en el carrito del usuario autenticado.
 * Si el producto no existe en el carrito, se retorna un error.
 */
export const editCartItem = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { product, quantity } = req.body;

    // Se asume que el carrito ya existe; si no, se puede crear o devolver error
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    // Buscar el ítem en el carrito
    const index = cart.items.findIndex(item => item.product.toString() === product);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "El producto no se encuentra en el carrito",
      });
    }

    // Actualizar la cantidad al valor recibido
    cart.items[index].quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Carrito actualizado exitosamente",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el carrito",
      error: err.message,
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
