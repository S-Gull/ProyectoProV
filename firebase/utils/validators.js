/**
 * Utilidades para validar datos antes de enviarlos a Firebase
 * Versión simplificada con validaciones básicas
 */

// Almacén para seguimiento de intentos de inicio de sesión
const loginAttempts_ahga = new Map();

/**
 * Registra un intento de inicio de sesión y verifica si el usuario ha excedido el límite
 * @param {string} email - Correo electrónico del usuario
 * @param {boolean} success - Si el intento fue exitoso o no
 * @returns {Object} Objeto con información sobre el estado de los intentos
 */
export const trackLoginAttempt_ahga = (email_ahga, success_ahga) => {
  const now_ahga = Date.now();
  const MAX_ATTEMPTS_ahga = 5;
  const BLOCK_DURATION_ahga = 15 * 60 * 1000; // 15 minutos

  const normalizedEmail_ahga = email_ahga.toLowerCase().trim();

  let record_ahga = loginAttempts_ahga.get(normalizedEmail_ahga) || {
    attempts: 0,
    lastAttempt: 0,
    blockedUntil: 0,
  };

  // Verificar si el usuario está bloqueado
  if (record_ahga.blockedUntil > now_ahga) {
    const blockTimeRemaining_ahga = Math.ceil(
      (record_ahga.blockedUntil - now_ahga) / 1000
    );
    return {
      blocked: true,
      remainingAttempts: 0,
      blockTimeRemaining: blockTimeRemaining_ahga,
    };
  }

  // Si el intento fue exitoso, reiniciar contador
  if (success_ahga) {
    loginAttempts_ahga.delete(normalizedEmail_ahga);
    return {
      blocked: false,
      remainingAttempts: MAX_ATTEMPTS_ahga,
      blockTimeRemaining: null,
    };
  }

  // Actualizar registro para intento fallido
  record_ahga.attempts += 1;
  record_ahga.lastAttempt = now_ahga;

  // Verificar si se debe bloquear al usuario
  if (record_ahga.attempts >= MAX_ATTEMPTS_ahga) {
    record_ahga.blockedUntil = now_ahga + BLOCK_DURATION_ahga;
    loginAttempts_ahga.set(normalizedEmail_ahga, record_ahga);

    return {
      blocked: true,
      remainingAttempts: 0,
      blockTimeRemaining: BLOCK_DURATION_ahga / 1000,
    };
  }

  loginAttempts_ahga.set(normalizedEmail_ahga, record_ahga);

  return {
    blocked: false,
    remainingAttempts: MAX_ATTEMPTS_ahga - record_ahga.attempts,
    blockTimeRemaining: null,
  };
};

/**
 * Utilidades para validar datos antes de enviarlos a Firebase
 * Versión simplificada con validaciones básicas
 */

/**
 * Valida un correo electrónico
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} true si es válido
 */
export const isValidEmail_ahga = (email_ahga) => {
  const emailRegex_ahga = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email_ahga || email_ahga.length > 254) {
    return false;
  }

  if (email_ahga.includes(" ")) {
    return false;
  }

  return emailRegex_ahga.test(email_ahga);
};

/**
 * Valida una contraseña con reglas básicas
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de la validación
 */
export const isValidPassword_ahga = (password_ahga) => {
  return basicPasswordValidation_ahga(password_ahga);
};

/**
 * Validación básica de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de la validación
 */
const basicPasswordValidation_ahga = (password_ahga) => {
  const errors_ahga = [];

  if (!password_ahga) {
    return {
      isValid: false,
      errors: ["La contraseña es requerida"],
    };
  }

  if (password_ahga.length < 8) {
    errors_ahga.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (password_ahga.length > 128) {
    errors_ahga.push("La contraseña no puede tener más de 128 caracteres");
  }

  if (!/[a-z]/.test(password_ahga)) {
    errors_ahga.push(
      "La contraseña debe contener al menos una letra minúscula"
    );
  }

  if (!/[A-Z]/.test(password_ahga)) {
    errors_ahga.push(
      "La contraseña debe contener al menos una letra mayúscula"
    );
  }

  if (!/\d/.test(password_ahga)) {
    errors_ahga.push("La contraseña debe contener al menos un número");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password_ahga)) {
    errors_ahga.push(
      "La contraseña debe contener al menos un carácter especial"
    );
  }

  // Verificar caracteres de control
  if (/[\x00-\x1F\x7F]/.test(password_ahga)) {
    errors_ahga.push("La contraseña contiene caracteres no permitidos");
  }

  return {
    isValid: errors_ahga.length === 0,
    errors: errors_ahga,
  };
};

/**
 * Verifica si las contraseñas coinciden
 * @param {string} password - Contraseña original
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} true si coinciden
 */
export const doPasswordsMatch_ahga = (password_ahga, confirmPassword_ahga) => {
  return password_ahga === confirmPassword_ahga;
};

/**
 * Detecta intentos de inyección básicos
 * @param {string} input - Entrada a verificar
 * @returns {Object} Resultado de la verificación
 */
export const detectInjectionAttempt_ahga = (input_ahga) => {
  if (!input_ahga || typeof input_ahga !== "string") {
    return { safe: true, reason: null };
  }

  // Verificar caracteres de control
  if (/[\x00-\x1F\x7F]/.test(input_ahga)) {
    return {
      safe: false,
      reason: "Contiene caracteres de control no permitidos",
    };
  }

  return { safe: true, reason: null };
};

/**
 * Evalúa la fortaleza de una contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {Object} Evaluación de fortaleza
 */
export const evaluatePasswordStrength_ahga = (password_ahga) => {
  let score_ahga = 0;
  const feedback_ahga = [];

  if (!password_ahga) {
    return {
      score: 0,
      level: "muy débil",
      feedback: ["La contraseña es requerida"],
    };
  }

  // Longitud
  if (password_ahga.length >= 8) score_ahga += 1;
  if (password_ahga.length >= 12) score_ahga += 1;
  if (password_ahga.length >= 16) score_ahga += 1;

  // Complejidad
  if (/[a-z]/.test(password_ahga)) score_ahga += 1;
  if (/[A-Z]/.test(password_ahga)) score_ahga += 1;
  if (/\d/.test(password_ahga)) score_ahga += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password_ahga)) score_ahga += 1;

  // Determinar nivel
  let level_ahga;
  if (score_ahga <= 2) {
    level_ahga = "muy débil";
    feedback_ahga.push("Contraseña muy débil");
  } else if (score_ahga <= 4) {
    level_ahga = "débil";
    feedback_ahga.push("Contraseña débil");
  } else if (score_ahga <= 6) {
    level_ahga = "moderada";
    feedback_ahga.push("Contraseña moderada");
  } else {
    level_ahga = "fuerte";
    feedback_ahga.push("Contraseña fuerte");
  }

  return {
    score: score_ahga,
    level: level_ahga,
    feedback: feedback_ahga,
  };
};

/**
 * Valida los datos de registro de usuario
 * @param {Object} userData - Datos del usuario a validar
 * @returns {Promise<Object>} Resultado de la validación
 */
export const validateUserRegistration_ahga = async ({
  email: email_ahga,
  password: password_ahga,
  confirmPassword: confirmPassword_ahga,
  username: username_ahga,
  firstName: firstName_ahga,
  lastName: lastName_ahga,
}) => {
  const errors_ahga = [];

  // Validar email
  if (!isValidEmail_ahga(email_ahga)) {
    errors_ahga.push("El correo electrónico no es válido");
  }

  // Validar contraseña
  const passwordValidation_ahga = isValidPassword_ahga(password_ahga);
  if (!passwordValidation_ahga.isValid) {
    errors_ahga.push(...passwordValidation_ahga.errors);
  }

  // Verificar que las contraseñas coincidan
  if (!doPasswordsMatch_ahga(password_ahga, confirmPassword_ahga)) {
    errors_ahga.push("Las contraseñas no coinciden");
  }

  // Validar campos opcionales si están presentes
  if (username_ahga && username_ahga.trim().length === 0) {
    errors_ahga.push("El nombre de usuario no puede estar vacío");
  }

  if (firstName_ahga && firstName_ahga.trim().length === 0) {
    errors_ahga.push("El nombre no puede estar vacío");
  }

  if (lastName_ahga && lastName_ahga.trim().length === 0) {
    errors_ahga.push("El apellido no puede estar vacío");
  }

  return {
    isValid: errors_ahga.length === 0,
    errors: errors_ahga,
  };
};

/**
 * Valida los datos de inicio de sesión
 * @param {Object} loginData - Datos de inicio de sesión
 * @returns {Promise<Object>} Resultado de la validación
 */
export const validateLogin_ahga = async ({
  email: email_ahga,
  password: password_ahga,
}) => {
  const errors_ahga = [];

  // Verificar que los campos no estén vacíos
  if (!email_ahga || email_ahga.trim().length === 0) {
    errors_ahga.push("El correo electrónico es requerido");
  }

  if (!password_ahga || password_ahga.trim().length === 0) {
    errors_ahga.push("La contraseña es requerida");
  }

  // Validar formato de email
  if (email_ahga && !isValidEmail_ahga(email_ahga)) {
    errors_ahga.push("El correo electrónico no es válido");
  }

  // Validar longitud mínima de contraseña
  if (password_ahga && password_ahga.length < 8) {
    errors_ahga.push("La contraseña debe tener al menos 8 caracteres");
  }

  // Verificar caracteres de control
  if (password_ahga && /[\x00-\x1F\x7F]/.test(password_ahga)) {
    errors_ahga.push("La contraseña contiene caracteres no permitidos");
  }

  return {
    isValid: errors_ahga.length === 0,
    errors: errors_ahga,
  };
};
