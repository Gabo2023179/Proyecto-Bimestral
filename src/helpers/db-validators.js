import User from "../user/user.model.js"
import Category from "../category/category.model.js"
// import Product from "../models/product.model.js";

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