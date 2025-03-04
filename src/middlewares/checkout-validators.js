import { validarCampos } from "../middlewares/validate-fields.js";
import { handleErrors } from "../middlewares/handle-errors.js";

/**
 * Validaciones para el proceso de checkout.
 * En este caso, no se reciben datos adicionales en el body,
 * por lo que se validan únicamente las condiciones generales.
 */
export const checkoutValidator = [
  // Aquí podrías agregar validaciones adicionales si fuera necesario.
  validarCampos,
  handleErrors,
];
