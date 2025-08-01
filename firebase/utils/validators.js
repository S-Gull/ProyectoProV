/**
 * Utilidades para validar datos antes de enviarlos a Firebase
 * Incluye validaciones de seguridad y protección contra ataques
 */

// Almacén para seguimiento de intentos de inicio de sesión
// En una aplicación real, esto debería persistirse en una base de datos o caché
const loginAttempts_ahga = new Map();

/**
 * Registra un intento de inicio de sesión y verifica si el usuario ha excedido el límite
 * @param {string} email - Correo electrónico del usuario
 * @param {boolean} success - Si el intento fue exitoso o no
 * @returns {Object} Objeto con información sobre el estado de los intentos
 * @returns {boolean} Object.blocked - Si el usuario está bloqueado temporalmente
 * @returns {number} Object.remainingAttempts - Intentos restantes antes del bloqueo
 * @returns {number|null} Object.blockTimeRemaining - Tiempo restante de bloqueo en segundos (si está bloqueado)
 */
export const trackLoginAttempt_ahga = (email_ahga, success_ahga) => {
  const now_ahga = Date.now();
  const MAX_ATTEMPTS_ahga = 5; // Máximo de intentos fallidos permitidos
  const BLOCK_DURATION_ahga = 15 * 60 * 1000; // 15 minutos en milisegundos
  
  // Normalizar email para evitar bypass con mayúsculas/minúsculas
  const normalizedEmail_ahga = email_ahga.toLowerCase().trim();
  
  // Obtener registro actual o crear uno nuevo
  let record_ahga = loginAttempts_ahga.get(normalizedEmail_ahga) || {
    attempts: 0,
    lastAttempt: 0,
    blockedUntil: 0
  };
  
  // Verificar si el usuario está bloqueado actualmente
  if (record_ahga.blockedUntil > now_ahga) {
    const blockTimeRemaining_ahga = Math.ceil((record_ahga.blockedUntil - now_ahga) / 1000);
    
    return {
      blocked: true,
      remainingAttempts: 0,
      blockTimeRemaining: blockTimeRemaining_ahga
    };
  }
  
  // Si el intento fue exitoso, reiniciar contador
  if (success_ahga) {
    loginAttempts_ahga.delete(normalizedEmail_ahga);
    return {
      blocked: false,
      remainingAttempts: MAX_ATTEMPTS_ahga,
      blockTimeRemaining: null
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
      blockTimeRemaining: BLOCK_DURATION_ahga / 1000
    };
  }
  
  // Actualizar registro y devolver estado
  loginAttempts_ahga.set(normalizedEmail_ahga, record_ahga);
  
  return {
    blocked: false,
    remainingAttempts: MAX_ATTEMPTS_ahga - record_ahga.attempts,
    blockTimeRemaining: null
  };
};

/**
 * Valida un correo electrónico con reglas más estrictas
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} true si es válido, false si no
 */
export const isValidEmail_ahga = (email_ahga) => {
  // Regex más estricto que verifica formato correcto de email
  // - Debe tener un nombre de usuario válido antes de @
  // - Debe tener un dominio válido después de @
  // - El dominio debe tener al menos un punto y una extensión válida
  // - No permite caracteres especiales inválidos
  const emailRegex_ahga = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Verificar longitud razonable
  if (!email_ahga || email_ahga.length > 254) {
    return false;
  }
  
  // Verificar que no tenga espacios en blanco
  if (email_ahga.includes(' ')) {
    return false;
  }
  
  return emailRegex_ahga.test(email_ahga);
};

/**
 * Valida que una contraseña cumpla con requisitos de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con resultado de validación
 * @returns {boolean} Object.isValid - Indica si la contraseña es válida
 * @returns {string|null} Object.errorMessage - Mensaje de error si no es válida
 */
export const isValidPassword_ahga = (password_ahga) => {
  // Usar directamente la validación básica por ahora
  // La política de contraseñas más avanzada se implementará cuando se importe correctamente
  return basicPasswordValidation_ahga(password_ahga);
};

/**
 * Validación básica de contraseña (fallback)
 * @param {string} password - Contraseña a validar
 * @returns {Object} Resultado de la validación
 */
const basicPasswordValidation_ahga = (password_ahga) => {
  // Verificar que la contraseña exista
  if (!password_ahga) {
    return {
      isValid: false,
      errorMessage: "La contraseña no puede estar vacía"
    };
  }
  
  // Verificar longitud mínima (8 caracteres es más seguro que 6)
  if (password_ahga.length < 8) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe tener al menos 8 caracteres"
    };
  }
  
  // Verificar que contenga al menos un número
  if (!/\d/.test(password_ahga)) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe contener al menos un número"
    };
  }
  
  // Verificar que contenga al menos una letra mayúscula
  if (!/[A-Z]/.test(password_ahga)) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe contener al menos una letra mayúscula"
    };
  }
  
  // Verificar que contenga al menos una letra minúscula
  if (!/[a-z]/.test(password_ahga)) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe contener al menos una letra minúscula"
    };
  }
  
  // Verificar que contenga al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password_ahga)) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe contener al menos un carácter especial (!@#$%^&*)"
    };
  }
  
  // Si pasa todas las validaciones
  return {
    isValid: true,
    errorMessage: null
  };
};

/**
 * Valida que dos contraseñas coincidan
 * @param {string} password - Contraseña principal
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} true si coinciden, false si no
 */
export const doPasswordsMatch_ahga = (password_ahga, confirmPassword_ahga) => {
  return password_ahga === confirmPassword_ahga;
};

/**
 * Evalúa la fortaleza de una contraseña y devuelve una puntuación
 * @param {string} password - Contraseña a evaluar
 * @returns {Object} Objeto con la evaluación de la contraseña
 * @returns {number} Object.score - Puntuación de 0 a 100
 * @returns {string} Object.strength - Descripción de la fortaleza (débil, media, fuerte, muy fuerte)
 * @returns {string} Object.color - Color recomendado para el indicador (rojo, naranja, amarillo, verde)
 * @returns {string[]} Object.suggestions - Sugerencias para mejorar la contraseña
 */
/**
 * Detecta posibles ataques de inyección en los campos de entrada
 * @param {string} input - Texto a validar
 * @returns {Object} Resultado de la validación
 * @returns {boolean} Object.safe - Si el input es seguro
 * @returns {string} Object.reason - Razón por la que el input no es seguro (si aplica)
 */
export const detectInjectionAttempt_ahga = (input_ahga) => {
  if (!input_ahga || typeof input_ahga !== 'string') {
    return { safe: true };
  }
  
  // Patrones de inyección SQL comunes
  const sqlPatterns_ahga = [
    /('|\\')\s*(OR|AND)\s*('|\\')\s*('|\\')\s*(=)\s*('|\\')/i, // ' OR ' = '
    /\b(OR|AND)\s+\d+\s*=\s*\d+/i, // OR 1=1
    /\b(OR|AND)\s+'[^']*'\s*=\s*'[^']*'/i, // OR 'a'='a'
    /\b(OR|AND)\s+[0-9]+=\s*[0-9]+/i, // OR 1=1
    /('|\\')\s*;\s*DROP\s+TABLE/i, // '; DROP TABLE
    /('|\\')\s*;\s*DELETE\s+FROM/i, // '; DELETE FROM
    /('|\\')\s*;\s*INSERT\s+INTO/i, // '; INSERT INTO
    /('|\\')\s*;\s*SELECT\s+/i, // '; SELECT 
    /\bUNION\s+(ALL\s+)?SELECT\b/i, // UNION (ALL) SELECT
    /\bEXEC\s*\(\s*xp_cmdshell/i, // EXEC(xp_cmdshell
    /--[\s\r\n]/i // Comentarios SQL
  ];
  
  // Patrones de inyección NoSQL comunes
  const noSqlPatterns_ahga = [
    /\{\s*\$\w+\s*:/i, // MongoDB operators
    /\$\w+\s*\(/i, // MongoDB function calls
    /\$\w+\s*:/i, // MongoDB operators
    /\$\{.*\}/i // Template string injection
  ];
  
  // Patrones de inyección JavaScript comunes
  const jsPatterns_ahga = [
    /<script[^>]*>[^<]*<\/script>/i, // <script>...</script>
    /javascript\s*:/i, // javascript:
    /\bon\w+\s*=\s*["']/i, // onclick=", onload=', etc.
    /eval\s*\(/i, // eval(
    /setTimeout\s*\(/i, // setTimeout(
    /setInterval\s*\(/i, // setInterval(
    /Function\s*\(/i, // Function(
    /document\.cookie/i, // document.cookie
    /document\.location/i, // document.location
    /document\.write/i, // document.write
    /\.innerHTML\s*=/i, // .innerHTML=
    /\.outerHTML\s*=/i // .outerHTML=
  ];
  
  // Patrones de inyección de comandos comunes
  const commandPatterns_ahga = [
    /;\s*\w+\s*\/[\w\/.]+/i, // ; command /path
    /\|\s*\w+/i, // | command
    /`[^`]*`/i, // `command`
    /\$\([^)]*\)/i, // $(command)
    /\&\s*\w+/i, // & command
    /\|\|\s*\w+/i, // || command
    /\>\s*\/[\w\/]+/i, // > /path
    /\<\s*\/[\w\/]+/i // < /path
  ];
  
  // Verificar cada patrón
  for (const pattern_ahga of sqlPatterns_ahga) {
    if (pattern_ahga.test(input_ahga)) {
      return { safe: false, reason: 'Posible intento de inyección SQL detectado' };
    }
  }
  
  for (const pattern_ahga of noSqlPatterns_ahga) {
    if (pattern_ahga.test(input_ahga)) {
      return { safe: false, reason: 'Posible intento de inyección NoSQL detectado' };
    }
  }
  
  for (const pattern_ahga of jsPatterns_ahga) {
    if (pattern_ahga.test(input_ahga)) {
      return { safe: false, reason: 'Posible intento de inyección JavaScript detectado' };
    }
  }
  
  for (const pattern_ahga of commandPatterns_ahga) {
    if (pattern_ahga.test(input_ahga)) {
      return { safe: false, reason: 'Posible intento de inyección de comandos detectado' };
    }
  }
  
  // Verificar caracteres de control o potencialmente peligrosos
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(input_ahga)) {
    return { safe: false, reason: 'Caracteres de control detectados' };
  }
  
  return { safe: true };
};

export const evaluatePasswordStrength_ahga = (password_ahga) => {
  if (!password_ahga) {
    return {
      score: 0,
      strength: "débil",
      color: "#ff4d4d", // rojo
      suggestions: ["Introduce una contraseña"]
    };
  }
  
  let score_ahga = 0;
  const suggestions_ahga = [];
  
  // Longitud (hasta 25 puntos)
  const lengthScore_ahga = Math.min(25, password_ahga.length * 3);
  score_ahga += lengthScore_ahga;
  
  if (password_ahga.length < 8) {
    suggestions_ahga.push("Añade más caracteres (mínimo 8)");
  }
  
  // Complejidad (hasta 75 puntos)
  // Letras minúsculas (15 puntos)
  if (/[a-z]/.test(password_ahga)) {
    score_ahga += 15;
  } else {
    suggestions_ahga.push("Añade letras minúsculas");
  }
  
  // Letras mayúsculas (15 puntos)
  if (/[A-Z]/.test(password_ahga)) {
    score_ahga += 15;
  } else {
    suggestions_ahga.push("Añade letras mayúsculas");
  }
  
  // Números (15 puntos)
  if (/\d/.test(password_ahga)) {
    score_ahga += 15;
  } else {
    suggestions_ahga.push("Añade números");
  }
  
  // Caracteres especiales (15 puntos)
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password_ahga)) {
    score_ahga += 15;
  } else {
    suggestions_ahga.push("Añade caracteres especiales (!@#$%^&*)");
  }
  
  // Variedad de caracteres (15 puntos)
  const uniqueChars_ahga = new Set(password_ahga).size;
  const varietyScore_ahga = Math.min(15, uniqueChars_ahga * 1.5);
  score_ahga += varietyScore_ahga;
  
  if (uniqueChars_ahga < 8) {
    suggestions_ahga.push("Usa más caracteres diferentes");
  }
  
  // Determinar fortaleza y color
  let strength_ahga = "débil";
  let color_ahga = "#ff4d4d"; // rojo
  
  if (score_ahga >= 90) {
    strength_ahga = "muy fuerte";
    color_ahga = "#2ecc71"; // verde
  } else if (score_ahga >= 70) {
    strength_ahga = "fuerte";
    color_ahga = "#27ae60"; // verde oscuro
  } else if (score_ahga >= 50) {
    strength_ahga = "media";
    color_ahga = "#f39c12"; // naranja
  } else if (score_ahga >= 30) {
    strength_ahga = "débil";
    color_ahga = "#e74c3c"; // rojo claro
  }
  
  return {
    score: score_ahga,
    strength: strength_ahga,
    color: color_ahga,
    suggestions: suggestions_ahga
  };
};

/**
 * Verifica si una contraseña ha sido comprometida en filtraciones de datos
 * utilizando la API de Have I Been Pwned (k-anonimidad)
 * @param {string} password - Contraseña a verificar
 * @returns {Promise<boolean>} - True si la contraseña ha sido comprometida
 */
export async function isPasswordCompromised_ahga(password_ahga) {
  try {
    // Calcular el hash SHA-1 de la contraseña
    const encoder = new TextEncoder();
    const data = encoder.encode(password_ahga);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    
    // Convertir el hash a formato hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Dividir el hash para la consulta k-anónima (los primeros 5 caracteres)
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Consultar la API de Have I Been Pwned
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error(`Error al consultar la API: ${response.status}`);
    }
    
    const text = await response.text();
    const hashes = text.split('\n');
    
    // Buscar si el sufijo del hash está en la respuesta
    for (const hash of hashes) {
      const [hashSuffix, count] = hash.split(':');
      if (hashSuffix.toUpperCase() === suffix) {
        return true; // La contraseña ha sido comprometida
      }
    }
    
    return false; // La contraseña no ha sido comprometida
  } catch (error) {
    console.error('Error al verificar si la contraseña ha sido comprometida:', error);
    return false; // En caso de error, asumimos que la contraseña no está comprometida
  }
}

/**
 * Valida datos de registro de usuario
 * @param {Object} userData - Datos del usuario a validar
 * @param {string} userData.email - Correo electrónico
 * @param {string} userData.password - Contraseña
 * @param {string} userData.confirmPassword - Confirmación de contraseña
 * @param {string} userData.username - Nombre de usuario (opcional)
 * @param {string} userData.firstName - Nombre (opcional)
 * @param {string} userData.lastName - Apellido (opcional)
 * @returns {Object} Objeto con resultado de validación
 * @returns {boolean} Object.isValid - Indica si los datos son válidos
 * @returns {string|null} Object.errorMessage - Mensaje de error si no son válidos
 */
export const validateUserRegistration_ahga = async ({ 
  email: email_ahga, 
  password: password_ahga, 
  confirmPassword: confirmPassword_ahga,
  username: username_ahga,
  firstName: firstName_ahga,
  lastName: lastName_ahga
}) => {
  // Verificar posibles ataques de inyección en todos los campos de texto
  const fieldsToCheck_ahga = [
    { value: email_ahga, name: "correo electrónico" },
    { value: password_ahga, name: "contraseña" },
    { value: confirmPassword_ahga, name: "confirmación de contraseña" },
    { value: username_ahga, name: "nombre de usuario" },
    { value: firstName_ahga, name: "nombre" },
    { value: lastName_ahga, name: "apellido" }
  ];
  
  for (const field_ahga of fieldsToCheck_ahga) {
    if (field_ahga.value) {
      const injectionCheck_ahga = detectInjectionAttempt_ahga(field_ahga.value);
      if (!injectionCheck_ahga.safe) {
        return {
          isValid: false,
          errorMessage: `Entrada no válida en el campo ${field_ahga.name}: ${injectionCheck_ahga.reason}`
        };
      }
    }
  }
  
  // Validar email
  if (!isValidEmail_ahga(email_ahga)) {
    return {
      isValid: false,
      errorMessage: "El correo electrónico no es válido"
    };
  }
  
  // Validar contraseña con las nuevas reglas
  const passwordValidation_ahga = isValidPassword_ahga(password_ahga);
  if (!passwordValidation_ahga.isValid) {
    return passwordValidation_ahga;
  }
  
  // Verificar si la contraseña ha sido comprometida en filtraciones de datos
  try {
    const isCompromised_ahga = await isPasswordCompromised_ahga(password_ahga);
    if (isCompromised_ahga) {
      return {
        isValid: false,
        errorMessage: "Esta contraseña ha aparecido en filtraciones de datos. Por seguridad, elige otra contraseña."
      };
    }
  } catch (error) {
    console.error("Error al verificar si la contraseña ha sido comprometida:", error);
    // Continuamos con la validación aunque no se pueda verificar si la contraseña ha sido comprometida
  }
  
  // Validar que las contraseñas coincidan
  if (!doPasswordsMatch_ahga(password_ahga, confirmPassword_ahga)) {
    return {
      isValid: false,
      errorMessage: "Las contraseñas no coinciden"
    };
  }
  
  // Validar nombre de usuario si está presente
  if (username_ahga !== undefined) {
    // Verificar que el nombre de usuario tenga al menos 3 caracteres
    if (!username_ahga || username_ahga.length < 3) {
      return {
        isValid: false,
        errorMessage: "El nombre de usuario debe tener al menos 3 caracteres"
      };
    }
    
    // Verificar que el nombre de usuario solo contenga caracteres alfanuméricos y guiones
    if (!/^[a-zA-Z0-9_-]+$/.test(username_ahga)) {
      return {
        isValid: false,
        errorMessage: "El nombre de usuario solo puede contener letras, números, guiones y guiones bajos"
      };
    }
  }
  
  // Validar nombre y apellido si están presentes
  if (firstName_ahga !== undefined && (!firstName_ahga || firstName_ahga.trim() === "")) {
    return {
      isValid: false,
      errorMessage: "El nombre no puede estar vacío"
    };
  }
  
  if (lastName_ahga !== undefined && (!lastName_ahga || lastName_ahga.trim() === "")) {
    return {
      isValid: false,
      errorMessage: "El apellido no puede estar vacío"
    };
  }
  
  // Si pasa todas las validaciones
  return {
    isValid: true,
    errorMessage: null
  };
};

/**
 * Valida datos de inicio de sesión con medidas de seguridad adicionales
 * @param {Object} loginData - Datos de inicio de sesión
 * @param {string} loginData.email - Correo electrónico
 * @param {string} loginData.password - Contraseña
 * @returns {Promise<Object>} Objeto con resultado de validación
 * @returns {boolean} Object.isValid - Indica si los datos son válidos
 * @returns {string|null} Object.errorMessage - Mensaje de error si no son válidos
 * @returns {string|null} Object.warningMessage - Mensaje de advertencia si la contraseña ha sido comprometida
 */
export const validateLogin_ahga = async ({ email: email_ahga, password: password_ahga }) => {
  // Verificar posibles ataques de inyección en todos los campos
  const fieldsToCheck_ahga = [
    { value: email_ahga, name: "correo electrónico" },
    { value: password_ahga, name: "contraseña" }
  ];
  
  for (const field_ahga of fieldsToCheck_ahga) {
    if (field_ahga.value) {
      const injectionCheck_ahga = detectInjectionAttempt_ahga(field_ahga.value);
      if (!injectionCheck_ahga.safe) {
        return {
          isValid: false,
          errorMessage: `Entrada no válida en el campo ${field_ahga.name}: ${injectionCheck_ahga.reason}`
        };
      }
    }
  }
  
  // Verificar que los campos no estén vacíos
  if (!email_ahga || email_ahga.trim() === "") {
    return {
      isValid: false,
      errorMessage: "El correo electrónico no puede estar vacío"
    };
  }
  
  if (!password_ahga || password_ahga.trim() === "") {
    return {
      isValid: false,
      errorMessage: "La contraseña no puede estar vacía"
    };
  }
  
  // Validar formato de correo electrónico
  if (!isValidEmail_ahga(email_ahga)) {
    return {
      isValid: false,
      errorMessage: "El formato del correo electrónico no es válido"
    };
  }
  
  // Verificar longitud mínima de contraseña
  // Esto es solo una verificación básica para el login, ya que la contraseña
  // debería haber sido validada más rigurosamente durante el registro
  if (password_ahga.length < 8) {
    return {
      isValid: false,
      errorMessage: "La contraseña debe tener al menos 8 caracteres"
    };
  }
  
  // Verificar que no haya caracteres de control o potencialmente peligrosos
  if (/[\x00-\x1F\x7F]/.test(email_ahga) || /[\x00-\x1F\x7F]/.test(password_ahga)) {
    return {
      isValid: false,
      errorMessage: "Los datos contienen caracteres no permitidos"
    };
  }
  
  // Verificar si la contraseña ha sido comprometida en filtraciones de datos
  try {
    const isCompromised_ahga = await isPasswordCompromised_ahga(password_ahga);
    if (isCompromised_ahga) {
      return {
        isValid: true, // Permitimos el inicio de sesión pero mostramos una advertencia
        errorMessage: null,
        warningMessage: "Tu contraseña ha aparecido en filtraciones de datos. Te recomendamos cambiarla por seguridad."
      };
    }
  } catch (error) {
    console.error("Error al verificar si la contraseña ha sido comprometida:", error);
    // Continuamos con la validación aunque no se pueda verificar si la contraseña ha sido comprometida
  }
  
  // Si pasa todas las validaciones
  return {
    isValid: true,
    errorMessage: null
  };
};