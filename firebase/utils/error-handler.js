/**
 * Utilidad para manejar errores de Firebase de forma centralizada
 * Proporciona mensajes de error amigables y consistentes
 */

/**
 * Códigos de error comunes de Firebase Authentication
 * @type {Object}
 */
const AUTH_ERROR_CODES_ahga = {
  "auth/email-already-in-use": "El correo electrónico ya está en uso",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
  "auth/invalid-email": "El correo electrónico no es válido",
  "auth/user-not-found": "El usuario está equivocado",
  "auth/wrong-password": "La contraseña está equivocada",
  "auth/invalid-credential": "El gmail o el usuario están equivocados",
};

/**
 * Códigos de error comunes de Firestore
 * @type {Object}
 */
const FIRESTORE_ERROR_CODES_ahga = {
  "permission-denied": "No tienes permisos para realizar esta acción",
  unavailable: "El servicio no está disponible en este momento",
  "not-found": "El documento solicitado no existe",
};

/**
 * Procesa un error de Firebase y devuelve un mensaje amigable
 * @param {Error} error - El error original de Firebase
 * @param {string} defaultMessage - Mensaje por defecto si no se encuentra un código específico
 * @returns {string} Mensaje de error amigable
 */
export const handleFirebaseError_ahga = (
  error_ahga,
  defaultMessage_ahga = "Ha ocurrido un error"
) => {

  // Verificar si es un error de autenticación
  if (error_ahga.code && AUTH_ERROR_CODES_ahga[error_ahga.code]) {
    return AUTH_ERROR_CODES_ahga[error_ahga.code];
  }

  // Verificar si es un error de Firestore
  if (error_ahga.code && FIRESTORE_ERROR_CODES_ahga[error_ahga.code]) {
    return FIRESTORE_ERROR_CODES_ahga[error_ahga.code];
  }

  // Si no se encuentra un código específico, devolver el mensaje por defecto
  return defaultMessage_ahga;
};

/**
 * Crea un nuevo Error con un mensaje amigable basado en el error original
 * @param {Error} error - El error original
 * @param {string} defaultMessage - Mensaje por defecto
 * @returns {Error} Error con mensaje amigable
 */
export const createFriendlyError_ahga = (
  error_ahga,
  defaultMessage_ahga = "Ha ocurrido un error"
) => {
  const friendlyMessage_ahga = handleFirebaseError_ahga(
    error_ahga,
    defaultMessage_ahga
  );
  return new Error(friendlyMessage_ahga);
};
