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
  maxConsecutiveChars: 3,  // Máximo de caracteres consecutivos iguales
  maxSequentialChars: 3,    // Máximo de caracteres secuenciales (123, abc)
  
  // Listas de verificación
  commonPasswords: [
    "password", "123456", "12345678", "qwerty", "admin", 
    "welcome", "password123", "abc123", "letmein", "monkey",
    "1234567", "12345", "111111", "1234567890", "123123",
    "contraseña", "usuario", "admin123", "administrador"
  ],
  
  // Configuración de caducidad
  expirationDays: 90,        // Días hasta que la contraseña caduque
  preventReuse: 5,           // Número de contraseñas anteriores que no se pueden reutilizar
  lockoutThreshold: 5,       // Intentos fallidos antes de bloqueo
  lockoutDurationMinutes: 15 // Duración del bloqueo en minutos
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
    errors_ahga.push(`La contraseña debe tener al menos ${PASSWORD_POLICY_ahga.minLength} caracteres`);
  }
  
  if (password_ahga && password_ahga.length > PASSWORD_POLICY_ahga.maxLength) {
    errors_ahga.push(`La contraseña no debe exceder los ${PASSWORD_POLICY_ahga.maxLength} caracteres`);
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
  
  if (PASSWORD_POLICY_ahga.requireSpecialChars && !/[^A-Za-z0-9]/.test(password_ahga)) {
    errors_ahga.push("La contraseña debe incluir al menos un carácter especial");
  }
  
  // Verificar caracteres consecutivos
  if (password_ahga) {
    const consecutiveRegex_ahga = new RegExp(`(.)\\1{${PASSWORD_POLICY_ahga.maxConsecutiveChars},}`);
    if (consecutiveRegex_ahga.test(password_ahga)) {
      errors_ahga.push(`La contraseña no debe contener más de ${PASSWORD_POLICY_ahga.maxConsecutiveChars} caracteres idénticos consecutivos`);
    }
  }
  
  // Verificar secuencias comunes
  if (password_ahga) {
    const sequences_ahga = [
      "abcdefghijklmnopqrstuvwxyz",
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "0123456789"
    ];
    
    for (const seq_ahga of sequences_ahga) {
      for (let i = 0; i <= seq_ahga.length - PASSWORD_POLICY_ahga.maxSequentialChars; i++) {
        const chunk_ahga = seq_ahga.substring(i, i + PASSWORD_POLICY_ahga.maxSequentialChars + 1);
        if (password_ahga.includes(chunk_ahga)) {
          errors_ahga.push(`La contraseña no debe contener secuencias obvias como "${chunk_ahga}"`); 
          break;
        }
        
        // También verificar secuencias inversas
        const reverseChunk_ahga = chunk_ahga.split('').reverse().join('');
        if (password_ahga.includes(reverseChunk_ahga)) {
          errors_ahga.push(`La contraseña no debe contener secuencias obvias como "${reverseChunk_ahga}"`);
          break;
        }
      }
    }
  }
  
  // Verificar contraseñas comunes
  if (PASSWORD_POLICY_ahga.commonPasswords.includes(password_ahga.toLowerCase())) {
    errors_ahga.push("La contraseña es demasiado común y fácil de adivinar");
  }
  
  return {
    valid: errors_ahga.length === 0,
    errors: errors_ahga
  };
};

/**
 * Genera una contraseña segura aleatoria que cumple con la política
 * @returns {string} Contraseña generada
 */
export const generateSecurePassword_ahga = () => {
  const lowercase_ahga = 'abcdefghijkmnopqrstuvwxyz'; // Sin 'l' para evitar confusión
  const uppercase_ahga = 'ABCDEFGHJKLMNPQRSTUVWXYZ';   // Sin 'O' para evitar confusión
  const numbers_ahga = '23456789';                     // Sin '0' y '1' para evitar confusión
  const special_ahga = '!@#$%^&*_-+=?';
  
  // Longitud aleatoria entre 12 y 16 caracteres
  const length_ahga = Math.floor(Math.random() * 5) + 12;
  
  // Asegurar al menos un carácter de cada tipo
  let password_ahga = [
    lowercase_ahga.charAt(Math.floor(Math.random() * lowercase_ahga.length)),
    uppercase_ahga.charAt(Math.floor(Math.random() * uppercase_ahga.length)),
    numbers_ahga.charAt(Math.floor(Math.random() * numbers_ahga.length)),
    special_ahga.charAt(Math.floor(Math.random() * special_ahga.length))
  ];
  
  // Completar con caracteres aleatorios
  const allChars_ahga = lowercase_ahga + uppercase_ahga + numbers_ahga + special_ahga;
  
  for (let i = 4; i < length_ahga; i++) {
    password_ahga.push(allChars_ahga.charAt(Math.floor(Math.random() * allChars_ahga.length)));
  }
  
  // Mezclar los caracteres
  for (let i = password_ahga.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password_ahga[i], password_ahga[j]] = [password_ahga[j], password_ahga[i]];
  }
  
  return password_ahga.join('');
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
export const isPasswordPreviouslyUsed_ahga = async (newPassword_ahga, passwordHistory_ahga) => {
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
    suggestions_ahga.push("Considere usar una contraseña más larga para mayor seguridad");
  }
  
  if (password_ahga && /^[A-Za-z]+$/.test(password_ahga)) {
    suggestions_ahga.push("Agregue números y caracteres especiales para fortalecer su contraseña");
  }
  
  if (password_ahga && /^[0-9]+$/.test(password_ahga)) {
    suggestions_ahga.push("Agregue letras y caracteres especiales para fortalecer su contraseña");
  }
  
  return suggestions_ahga;
};