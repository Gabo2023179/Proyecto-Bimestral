import { hash } from "argon2"
import User from "./user.model.js"
import fs from "fs/promises"

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
