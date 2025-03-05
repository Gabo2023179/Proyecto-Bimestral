import { hash } from "argon2"
import User from "./user.model.js"
import Invoice from "../invoice/invoice.model.js"; 
import { generateJWT } from "../helpers/generate-jwt.js";
import fs from "fs/promises"
import { filterUserUpdateData } from "../helpers/db-validators.js";

export const getUserById = async (req, res) => {
    try {
        const { usuario } = req
        const user = await User.findById(usuario)

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        const { limite = 5, desde = 0 } = req.query
        const query = { status: true }

        const [total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        return res.status(200).json({
            success: true,
            total,
            users
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        })
    }
}

export const deleteUser = async (req, res) => {  
    try {  
      // Se utiliza el ID del usuario autenticado
      const userId = req.usuario._id;
  
      const user = await User.findByIdAndUpdate(userId, { status: false }, { new: true });
      
      return res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
        user
      });
    } catch (err) {  
      return res.status(500).json({
        success: false, 
        message: 'Error al eliminar usuario', 
        error: err.message 
      });
    }
  };
  
export const updateUser = async (req, res) => {  
    try {  
      // Obtenemos el ID del usuario autenticado a partir del token
      const userId = req.usuario._id;
      const data = req.body;  // Cualquier dato a actualizar
      
      // Ignoramos cualquier intento de actualizar el campo 'uid' u otros campos sensibles (si ya se validó en el middleware)
      const user = await User.findByIdAndUpdate(userId, data, { new: true });
      
      return res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        user
      });
    } catch (err) {  
      return res.status(500).json({
        success: false, 
        message: 'Error al actualizar usuario', 
        error: err.message 
      });
    }
  };

  export const updateUserById = async (req, res) => {
    try {
      // Obtenemos el ID del usuario a actualizar desde los parámetros
      const { uid } = req.params;
      // Filtramos los datos recibidos para evitar actualizar campos sensibles
      const data = filterUserUpdateData(req.body);
  
      // Actualizamos el usuario y obtenemos el documento actualizado
      const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Usuario actualizado exitosamente",
        user: updatedUser
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        error: err.message
      });
    }
  };

  export const getUserPurchaseHistory = async (req, res) => {
    try {
      const userId = req.usuario._id;  // Obtener el ID del usuario autenticado
  
      // Buscar las facturas asociadas a este usuario
      const invoices = await Invoice.find({ user: userId })
        .populate("items.product", "name price")  // Obtener detalles del producto
        .select("items total status createdAt");  // Seleccionar los campos que queremos ver en la respuesta
  
      if (invoices.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron compras para este usuario",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Historial de compras obtenido exitosamente",
        purchases: invoices,
      });
    } catch (err) {
      console.error("Error al obtener el historial de compras:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener el historial de compras",
        error: err.message,
      });
    }
  };
  export const createUser = async (req, res) => {
    try {
      // Solo un usuario con rol ADMIN puede crear nuevos usuarios.
      if (req.usuario.role !== "ADMIN") {
        return res.status(401).json({
          success: false,
          message: "No tienes permisos para crear usuarios."
        });
      }
  
      const data = req.body;
  
      // Si no se especifica el rol, asignar "CLIENT" por defecto.
      if (!data.role) {
        data.role = "CLIENT";
      }
  
      // Cifrar la contraseña
      const encryptedPassword = await hash(data.password);
      data.password = encryptedPassword;
  
      // Crear el usuario (admin o client, según se indique)
      const user = await User.create(data);
  
      // Generar token solo si se creó un administrador.
      let token = null;
      if (user.role === "ADMIN") {
        token = await generateJWT(user._id);
      }
  
      return res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        user,
        token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error al crear el usuario",
        error: error.message,
      });
    }
  };