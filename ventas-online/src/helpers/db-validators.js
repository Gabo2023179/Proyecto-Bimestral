import User from "../user/user.model.js"


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

export const userIsDeleted = async (uid = " ") => {
    const user = await User.findById(uid)

    if(user.status === false){
        throw new Error("El usuario ya fue eliminado")
    }
}