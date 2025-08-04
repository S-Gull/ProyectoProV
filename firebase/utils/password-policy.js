/**
 * Utilidad para implementar políticas de contraseñas seguras
 * Incluye funciones para validar, generar y gestionar contraseñas
 */

/**
 * Configuración de la política de contraseñas
 */
export const PASSWORD_POLICY_ahga = {
  // Requisitos mínimos
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: true,

  // Restricciones
  maxLength: 64,
};

/**
 * Verifica si una contraseña cumple con la política de seguridad
 * @param {string} password - Contraseña a verificar
 * @returns {Object} Resultado de la validación
 * @returns {boolean} Object.valid - Si la contraseña es válida
 * @returns {string[]} Object.errors - Lista de errores encontrados
 */
export const validatePasswordPolicy_ahga = (password_ahga) => {
  const errors_ahga = [];

  // Verificar longitud mínima y máxima
  if (!password_ahga || password_ahga.length < PASSWORD_POLICY_ahga.minLength) {
    errors_ahga.push(
      `La contraseña debe tener al menos ${PASSWORD_POLICY_ahga.minLength} caracteres`
    );
  }

  if (password_ahga && password_ahga.length > PASSWORD_POLICY_ahga.maxLength) {
    errors_ahga.push(
      `La contraseña no debe exceder los ${PASSWORD_POLICY_ahga.maxLength} caracteres`
    );
  }

  // Verificar requisitos de caracteres
  if (PASSWORD_POLICY_ahga.requireLowercase && !/[a-z]/.test(password_ahga)) {
    errors_ahga.push("La contraseña debe incluir al menos una letra minúscula");
  }

  if (PASSWORD_POLICY_ahga.requireUppercase && !/[A-Z]/.test(password_ahga)) {
    errors_ahga.push("La contraseña debe incluir al menos una letra mayúscula");
  }

  if (PASSWORD_POLICY_ahga.requireNumbers && !/[0-9]/.test(password_ahga)) {
    errors_ahga.push("La contraseña debe incluir al menos un número");
  }

  if (
    PASSWORD_POLICY_ahga.requireSpecialChars &&
    !/[^A-Za-z0-9]/.test(password_ahga)
  ) {
    errors_ahga.push(
      "La contraseña debe incluir al menos un carácter especial"
    );
  }

  return {
    valid: errors_ahga.length === 0,
    errors: errors_ahga,
  };
};

/**
 * Calcula los días restantes hasta que caduque una contraseña
 * @param {Date} lastPasswordChange - Fecha del último cambio de contraseña
 * @returns {number} Días restantes (negativo si ya caducó)
 */
export const getPasswordExpirationDays_ahga = (lastPasswordChange_ahga) => {
  const today_ahga = new Date();
  const changeDate_ahga = new Date(lastPasswordChange_ahga);
  const diffTime_ahga = changeDate_ahga.getTime() - today_ahga.getTime();
  const diffDays_ahga = Math.ceil(diffTime_ahga / (1000 * 60 * 60 * 24));

  return PASSWORD_POLICY_ahga.expirationDays + diffDays_ahga;
};

/**
 * Verifica si una contraseña ha sido utilizada anteriormente
 * @param {string} newPassword - Nueva contraseña a verificar
 * @param {string[]} passwordHistory - Historial de contraseñas anteriores (hash)
 * @returns {boolean} true si la contraseña ya fue utilizada
 */
export const isPasswordPreviouslyUsed_ahga = async (
  newPassword_ahga,
  passwordHistory_ahga
) => {
  // En una implementación real, aquí se compararían hashes de contraseñas
  // Para este ejemplo, simplemente comparamos las contraseñas directamente
  return passwordHistory_ahga.includes(newPassword_ahga);
};

/**
 * Sugiere mejoras para una contraseña débil
 * @param {string} password - Contraseña a analizar
 * @returns {string[]} Sugerencias para mejorar la contraseña
 */
export const suggestPasswordImprovements_ahga = (password_ahga) => {
  const suggestions_ahga = [];
  const validation_ahga = validatePasswordPolicy_ahga(password_ahga);

  // Si la contraseña ya es válida, no hay sugerencias
  if (validation_ahga.valid) {
    return ["La contraseña cumple con la política de seguridad"];
  }

  // Agregar las sugerencias basadas en los errores
  suggestions_ahga.push(...validation_ahga.errors);

  // Sugerencias adicionales
  if (password_ahga && password_ahga.length < 12) {
    suggestions_ahga.push(
      "Considere usar una contraseña más larga para mayor seguridad"
    );
  }

  if (password_ahga && /^[A-Za-z]+$/.test(password_ahga)) {
    suggestions_ahga.push(
      "Agregue números y caracteres especiales para fortalecer su contraseña"
    );
  }

  if (password_ahga && /^[0-9]+$/.test(password_ahga)) {
    suggestions_ahga.push(
      "Agregue letras y caracteres especiales para fortalecer su contraseña"
    );
  }

  return suggestions_ahga;
};
