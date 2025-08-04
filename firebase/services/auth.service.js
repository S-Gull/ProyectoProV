/**
 * Servicio de autenticación para manejar operaciones relacionadas con usuarios
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

import { auth_ahga, db_ahga } from "./index.js";
import { createFriendlyError_ahga } from "../utils/error-handler.js";

/**
 * Genera un código de cupón único
 * @param {number} longitud_ahga - Longitud del código
 * @returns {string} Código de cupón generado
 */
const generarCodigoCupon_ahga = (longitud_ahga = 10) => {
  const caracteres_ahga = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo_ahga = "NUEVO";
  for (let i = 0; i < longitud_ahga - 5; i++) {
    codigo_ahga += caracteres_ahga.charAt(
      Math.floor(Math.random() * caracteres_ahga.length)
    );
  }
  return codigo_ahga;
};

/**
 * Crea un cupón de bienvenida para un nuevo usuario
 * @param {string} userId_ahga - ID del usuario
 * @returns {Promise<string>} Código del cupón creado
 */
const crearCuponBienvenida_ahga = async (userId_ahga) => {
  try {
    const codigoCupon_ahga = generarCodigoCupon_ahga();
    const fechaVencimiento_ahga = new Date();
    fechaVencimiento_ahga.setDate(fechaVencimiento_ahga.getDate() + 20); // 20 días de validez

    const cuponData_ahga = {
      codigo: codigoCupon_ahga,
      userId: userId_ahga,
      descuento: 0.3, // 30% de descuento (0.3 para cálculo directo)
      fechaVencimiento: fechaVencimiento_ahga.toISOString(),
      usado: false,
      activo: true,
    };

    await addDoc(collection(db_ahga, "cupones"), cuponData_ahga);
    console.log(`Cupón de bienvenida creado: ${codigoCupon_ahga}`);
    return codigoCupon_ahga;
  } catch (error_ahga) {
    console.error("Error al crear cupón de bienvenida:", error_ahga);
    throw error_ahga;
  }
};

/**
 * Registra un nuevo usuario con email y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {Object} additionalData - Datos adicionales del usuario para guardar en Firestore
 * @returns {Promise<UserCredential>} Credenciales del usuario registrado
 * @throws {Error} Error con mensaje amigable si falla el registro
 */
export const registrarUsuario_ahga = async (
  email_ahga,
  password_ahga,
  additionalData_ahga = {}
) => {
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
      password: password_ahga,
      uid: userCredential_ahga.user.uid,
      fechaRegistro: new Date().toISOString(),
      ...additionalData_ahga,
    });

    // Crear cupón de bienvenida automáticamente
    const codigoCupon_ahga = await crearCuponBienvenida_ahga(
      userCredential_ahga.user.uid
    );
    console.log(
      `Usuario registrado con cupón de bienvenida: ${codigoCupon_ahga}`
    );

    return userCredential_ahga;
  } catch (error_ahga) {
    throw createFriendlyError_ahga(error_ahga, "Error al registrar usuario");
  }
};

/**
 * Verificar el estado actual del usuario autenticado
 * @returns {Object|null} Información del usuario actual o null si no está autenticado
 */
export const verificarUsuarioActual_ahga = () => {
  const user = auth_ahga.currentUser;
  if (user) {
    console.log("👤 Usuario autenticado:", {
      email: user.email,
      uid: user.uid,
      emailVerified: user.emailVerified,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
    });
    return {
      email: user.email,
      uid: user.uid,
      emailVerified: user.emailVerified,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
    };
  } else {
    console.log("❌ No hay usuario autenticado");
    return null;
  }
};

/**
 * Inicia sesión con email y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<UserCredential>} Credenciales del usuario autenticado
 * @throws {Error} Error con mensaje amigable si falla el inicio de sesión
 */
export const iniciarSesion_ahga = async (email_ahga, password_ahga) => {
  try {
    // Intentar iniciar sesión
    const result_ahga = await signInWithEmailAndPassword(
      auth_ahga,
      email_ahga,
      password_ahga
    );

    return result_ahga;
  } catch (error_ahga) {
    throw createFriendlyError_ahga(error_ahga, "Error al iniciar sesión");
  }
};

/**
 * Cierra la sesión del usuario actual
 * @returns {Promise<void>}
 * @throws {Error} Error con mensaje amigable si falla el cierre de sesión
 */
export const cerrarSesion_ahga = async () => {
  try {
    return await signOut(auth_ahga);
  } catch (error_ahga) {
    console.error("Error en cerrarSesion_ahga:", error_ahga);
    throw createFriendlyError_ahga(error_ahga, "Error al cerrar sesión");
  }
};

/**
 * Cambia la contraseña del usuario actual
 * @param {string} passwordActual - Contraseña actual del usuario
 * @param {string} nuevaPassword - Nueva contraseña del usuario
 * @returns {Promise<void>}
 * @throws {Error} Error con mensaje amigable si falla el cambio de contraseña
 */
export const cambiarPassword_ahga = async (
  passwordActual_ahga,
  nuevaPassword_ahga
) => {
  try {
    const user = auth_ahga.currentUser;
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }

    // Re-autenticar al usuario con su contraseña actual
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordActual_ahga
    );
    await reauthenticateWithCredential(user, credential);

    // Cambiar la contraseña en Firebase Authentication
    await updatePassword(user, nuevaPassword_ahga);
    console.log(
      "✅ Contraseña actualizada correctamente en Firebase Authentication"
    );

    // Actualizar la contraseña en Firestore
    const userDocRef = doc(db_ahga, "users", user.uid);
    await updateDoc(userDocRef, {
      password: nuevaPassword_ahga,
    });
    console.log(
      "✅ Contraseña actualizada correctamente en Firestore Database"
    );

    console.log("📧 Usuario:", user.email);
    console.log(
      "🔐 La nueva contraseña ha sido guardada de forma segura en Firebase y Firestore"
    );
  } catch (error_ahga) {
    console.error("Error en cambiarPassword_ahga:", error_ahga);

    // Manejar errores específicos
    if (error_ahga.code === "auth/wrong-password") {
      throw new Error("La contraseña actual es incorrecta");
    } else if (error_ahga.code === "auth/weak-password") {
      throw new Error("La nueva contraseña es muy débil");
    } else if (error_ahga.code === "auth/requires-recent-login") {
      throw new Error("Por seguridad, necesitas volver a iniciar sesión");
    }

    throw createFriendlyError_ahga(error_ahga, "Error al cambiar contraseña");
  }
};
