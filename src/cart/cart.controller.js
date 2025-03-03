import Cart from "../models/cart.model.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.usuario._id;  // Se asume que el middleware JWT agrega req.usuario

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

export const addToCart = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const { product, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(item => item.product.toString() === product);

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Producto agregado al carrito", cart });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Error al agregar al carrito", error: err.message });
  }
};

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
