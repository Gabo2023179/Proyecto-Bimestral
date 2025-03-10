import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists, validateUserNotDeleted } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { hasRoles, validateUpdateRole, adminCantEditOtherAdmin, validateDeleteRole, adminCantDeleteOtherAdmin} from "./validate-roles.js";
import { validateJWT } from "./validate-jwt.js";
import { check } from "express-validator";
import { hash } from "argon2"; 
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js"; // Asegúrate de tener bcryptjs instalado


export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase:1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),  
    body("role").optional().isIn(["CLIENT"]).withMessage("Solo se permite rol CLIENTE"), /* Aqui hacemos que role sea opcional para que por default un usuario sea CLIENT,
     verificamos si los roles son ADMIN O CLIENT .isIN y tiramos mesaje.
    */
    validarCampos,
    handleErrors
]
export const loginValidator = [
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().isString().withMessage("Username es en formáto erróneo"),
    body("password").isLength({min: 4}).withMessage("El password debe contener al menos 8 caracteres"),
    validarCampos,
    handleErrors
]

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN"),
    param("uid").isMongoId().withMessage("No es un ID válido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

export const deleteUserValidator = [
    validateJWT, // Verifica que el usuario tenga un token válido
    hasRoles("ADMIN", "CLIENT"),
    adminCantDeleteOtherAdmin,
    validateDeleteRole, // Solo ADMIN o CLIENT pueden eliminar usuarios
    check("usuario").custom(validateUserNotDeleted), // Usa el validador importado
    validarCampos, // Revisa si hay errores en la validación antes de continuar
    handleErrors // Maneja errores y los devuelve en formato JSON
];

export const adminUpdateUserValidator = [
    validateJWT, // Verifica que el usuario tenga un token JWT válido.
    hasRoles("ADMIN", "CLIENT"),
    validateUpdateRole, 
    adminCantEditOtherAdmin,
    param("uid", "No es un ID válido").isMongoId(), // Valida que `uid` en los parámetros sea un ID de MongoDB válido.
    param("uid").custom(userExists), // Valida que el usuario con ese `uid` exista en la base de datos.
    validarCampos, // Revisa si hay errores en las validaciones anteriores antes de continuar.
    handleErrors // Maneja errores y los devuelve en formato JSON.
];


export const createDefaultAdmin = async (req, res) => {
    // Si res no está definido, asignar un objeto dummy que permita evitar el error
    res = res || { status: (code) => ({ json: (data) => data }) };
  
    try {
      const adminExists = await User.findOne({ role: "ADMIN" });
      if (!adminExists) {
        const defaultAdmin = {
          name: "admin",
          surname: "123",
          username: "admin123",
          email: "admin123@example.com",
          password: await hash("SecureP@ssword123"),
          phone: "12345678",
          role: "ADMIN",
          status: true,
        };
  
        const createdAdmin = await User.create(defaultAdmin);
        
        // Generar el token para el admin creado
        const token = await generateJWT(createdAdmin._id);
        
        return res.status(201).json({
          success: true,
          message: "Default admin created",
          token,
        });
      } else {
        // Si el admin ya existe, generamos un token nuevo para el admin existente
        const token = await generateJWT(adminExists._id);
        return res.status(200).json({
          success: true,
          message: "Admin already exists. Token generated.",
          token,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error creating default admin",
        error: error.message,
      });
    }
  };

  export const createUserValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isStrongPassword({
        minLength: 8,
        minLowercase:1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),  
    body("role").optional().isIn(["ADMIN", "CLIENT"]).withMessage("Rol no válido, debe ser 'ADMIN' o 'CLIENT'"), /* Aqui hacemos que role sea opcional para que por default un usuario sea CLIENT,
     verificamos si los roles son ADMIN O CLIENT .isIN y tiramos mesaje.
    */
    validarCampos,
    handleErrors
]