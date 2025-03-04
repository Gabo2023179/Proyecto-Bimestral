import User from "../user/user.model.js"
import Category from "../category/category.model.js"

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