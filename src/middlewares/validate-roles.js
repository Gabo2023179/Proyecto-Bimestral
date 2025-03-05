import User from "../user/user.model.js";

export const hasRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        success: false,
        message: "Se requiere validar el role antes de validar el token",
      });
    }

    if (req.usuario.role === "ADMIN" && req.body.role) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes el rol ADMIN",
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        success: false,
        message: `Usuario no autorizado, El recurso requiere uno de los siguientes roles: ${roles}`,
      });
    }
    next();
  };
};

export const validateUpdateRole = (req, res, next) => {
  if (req.usuario.role === "CLIENT" && req.body.role) {
    return res.status(400).json({
      success: false,
      message:
        "No tienes permiso para cambiar tu propio rol. Solo un ADMIN puede hacerlo.",
    });
  } else if (req.usuario.role === "CLIENT" && req.body.uid) {
    return res.status(400).json({
      success: false,
      message:
        "No tienes permiso para cambiar tu propio rol. Solo un ADMIN puede hacerlo.",
    });
  }

  next();
};

export const validateDeleteRole = (req, res, next) => {
  if (req.usuario.role === "CLIENT" && req.body.uid) {
    return res.status(400).json({
      success: false,
      message: "No tienes permiso para eliminar tu propio usuario.",
    });
  }
  next();
};

export const adminCantDeleteOtherAdmin = async (req, res, next) => {
  try {
    if (req.body.uid) {
      const targetUser = await User.findById(req.body.uid);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      if (targetUser.status === false) {
        return res.status(400).json({
          success: false,
          message: "El usuario ya está eliminado",
        });
      }
      if (req.usuario.role === "ADMIN" && targetUser.role === "ADMIN") {
        return res.status(401).json({
          success: false,
          message: "No puedes eliminar a otro ADMIN",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al validar la eliminacion de usuario",
      error: error.message,
    });
  }
};

export const adminCantEditOtherAdmin = async (req, res, next) => {
  try {
    if (req.body.uid) {
      const targetUser = await User.findById(req.body.uid);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      if (req.usuario.role === "ADMIN" && targetUser.role === "ADMIN") {
        return res.status(401).json({
          success: false,
          message: "No puedes editar a otro ADMIN",
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al validar la edición de usuario",
      error: error.message,
    });
  }
};
