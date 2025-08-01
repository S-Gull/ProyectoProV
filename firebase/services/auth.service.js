/**
 * Servicio de autenticación para manejar operaciones relacionadas con usuarios
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

import { auth_ahga, db_ahga } from "./index.js";
import { createFriendlyError_ahga } from "../utils/error-handler.js";
import { trackLoginAttempt_ahga } from "../utils/validators.js";

/**
 * Registra un nuevo usuario con email y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {Object} additionalData - Datos adicionales del usuario para guardar en Firestore
 * @returns {Promise<UserCredential>} Credenciales del usuario registrado
 * @throws {Error} Error con mensaje amigable si falla el registro
 */
export async function registrarUsuario_ahga(email_ahga, password_ahga, additionalData_ahga = {}) {
  try {
    // Crear usuario en Firebase Authentication
    const userCredential_ahga = await createUserWithEmailAndPassword(
      auth_ahga,
      email_ahga,
      password_ahga
    );

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db_ahga, "users", userCredential_ahga.user.uid), {
      email: email_ahga,
      uid: userCredential_ahga.user.uid,
      ...additionalData_ahga,
    });

    return userCredential_ahga;
  } catch (error_ahga) {
    console.error("Error en registrarUsuario_ahga:", error_ahga);
    throw createFriendlyError_ahga(error_ahga, "Error al registrar usuario");
  }
}

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<UserCredential>} Credenciales del usuario autenticado
 * @throws {Error} Error con mensaje amigable si falla el inicio de sesión
 */
export async function iniciarSesion_ahga(email_ahga, password_ahga) {
  // Verificar si el usuario está bloqueado por demasiados intentos fallidos
  const loginStatus_ahga = trackLoginAttempt_ahga(email_ahga, false); // Inicialmente marcamos como fallido
  
  if (loginStatus_ahga.blocked) {
    const minutos_ahga = Math.ceil(loginStatus_ahga.blockTimeRemaining / 60);
    throw new Error(`Demasiados intentos fallidos. Por seguridad, la cuenta está bloqueada temporalmente. Intente nuevamente en ${minutos_ahga} minutos.`);
  }
  
  try {
    // Intentar iniciar sesión
    const result_ahga = await signInWithEmailAndPassword(auth_ahga, email_ahga, password_ahga);
    
    // Si llegamos aquí, el inicio de sesión fue exitoso, actualizar el contador
    trackLoginAttempt_ahga(email_ahga, true);
    
    return result_ahga;
  } catch (error_ahga) {
    console.error("Error en iniciarSesion_ahga:", error_ahga);
    
    // El inicio de sesión falló, el contador ya se incrementó al principio
    // Verificar si este intento fallido causó un bloqueo
    const updatedStatus_ahga = trackLoginAttempt_ahga(email_ahga, false);
    
    if (updatedStatus_ahga.blocked) {
      throw new Error(`Demasiados intentos fallidos. Por seguridad, la cuenta está bloqueada temporalmente por ${Math.ceil(updatedStatus_ahga.blockTimeRemaining / 60)} minutos.`);
    } else if (updatedStatus_ahga.remainingAttempts > 0) {
      throw new Error(`Credenciales incorrectas. Le quedan ${updatedStatus_ahga.remainingAttempts} intentos antes de que la cuenta se bloquee temporalmente.`);
    }
    
    throw createFriendlyError_ahga(error_ahga, "Error al iniciar sesión");
  }
}

/**
 * Cierra la sesión del usuario actual
 * @returns {Promise<void>}
 * @throws {Error} Error con mensaje amigable si falla el cierre de sesión
 */
export async function cerrarSesion_ahga() {
  try {
    return await signOut(auth_ahga);
  } catch (error_ahga) {
    console.error("Error en cerrarSesion_ahga:", error_ahga);
    throw createFriendlyError_ahga(error_ahga, "Error al cerrar sesión");
  }
}