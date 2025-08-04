/**
 * Servicio para operaciones con Firestore
 * Maneja todas las interacciones con la base de datos
 */

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

import { db_ahga } from "./index.js";
import { createFriendlyError_ahga } from "../utils/error-handler.js";

/**
 * Inserta productos en la colección de Firestore
 * @param {Array<Object>} productos - Array de objetos de productos para insertar
 * @returns {Promise<void>}
 * @throws {Error} Error con mensaje amigable si falla la inserción
 */
export const insertarProductos_ahga = async (productos_ahga) => {
  try {
    for (let producto_ahga of productos_ahga) {
      await setDoc(
        doc(db_ahga, "productos", String(producto_ahga.id)),
        producto_ahga
      );
      console.log(`Producto ${producto_ahga.nombre} insertado con éxito.`);
    }
  } catch (error_ahga) {
    console.error("Error al insertar productos:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al guardar productos en la base de datos"
    );
  }
};

/**
 * Obtiene un producto por su ID
 * @param {string|number} id - ID del producto
 * @returns {Promise<Object|null>} Datos del producto o null si no existe
 * @throws {Error} Error con mensaje amigable si falla la consulta
 */
export const obtenerProducto_ahga = async (id_ahga) => {
  try {
    const docRef_ahga = doc(db_ahga, "productos", String(id_ahga));
    const docSnap_ahga = await getDoc(docRef_ahga);

    if (docSnap_ahga.exists()) {
      return { id: docSnap_ahga.id, ...docSnap_ahga.data() };
    } else {
      return null;
    }
  } catch (error_ahga) {
    console.error("Error al obtener producto:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener información del producto"
    );
  }
};

/**
 * Obtiene todos los productos
 * @returns {Promise<Array<Object>>} Array de productos
 * @throws {Error} Error con mensaje amigable si falla la consulta
 */
export const obtenerProductos_ahga = async () => {
  try {
    const querySnapshot_ahga = await getDocs(collection(db_ahga, "productos"));
    const productos_ahga = [];

    querySnapshot_ahga.forEach((doc_ahga) => {
      productos_ahga.push({ id: doc_ahga.id, ...doc_ahga.data() });
    });

    return productos_ahga;
  } catch (error_ahga) {
    console.error("Error al obtener productos:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al cargar la lista de productos"
    );
  }
};

/**
 * Valida credenciales de usuario consultando directamente Firestore
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object|null>} Datos del usuario si las credenciales son válidas, null si no
 * @throws {Error} Error con mensaje amigable si falla la consulta
 */
export const validarCredencialesFirestore_ahga = async (email_ahga, password_ahga) => {
  try {
    const q_ahga = query(
      collection(db_ahga, "users"),
      where("email", "==", email_ahga),
      where("password", "==", password_ahga)
    );
    
    const querySnapshot_ahga = await getDocs(q_ahga);
    
    if (!querySnapshot_ahga.empty) {
      const doc_ahga = querySnapshot_ahga.docs[0];
      return { id: doc_ahga.id, ...doc_ahga.data() };
    } else {
      return null;
    }
  } catch (error_ahga) {
    console.error("Error al validar credenciales:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al validar credenciales del usuario"
    );
  }
};

/**
 * Obtiene datos de un usuario por su ID
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object|null>} Datos del usuario o null si no existe
 * @throws {Error} Error con mensaje amigable si falla la consulta
 */
export const obtenerUsuario_ahga = async (userId_ahga) => {
  try {
    const docRef_ahga = doc(db_ahga, "users", userId_ahga);
    const docSnap_ahga = await getDoc(docRef_ahga);

    if (docSnap_ahga.exists()) {
      return { id: docSnap_ahga.id, ...docSnap_ahga.data() };
    } else {
      return null;
    }
  } catch (error_ahga) {
    console.error("Error al obtener usuario:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener información del usuario"
    );
  }
};

/**
 * Actualiza los datos de un usuario en Firestore
 * @param {string} userId - ID del usuario
 * @param {Object} datosActualizados - Datos a actualizar
 * @returns {Promise<void>}
 * @throws {Error} Error con mensaje amigable si falla la actualización
 */
export const actualizarUsuario_ahga = async (
  userId_ahga,
  datosActualizados_ahga
) => {
  try {
    const docRef_ahga = doc(db_ahga, "users", userId_ahga);
    await updateDoc(docRef_ahga, datosActualizados_ahga);
    console.log("Usuario actualizado correctamente en Firestore");
  } catch (error_ahga) {
    console.error("Error al actualizar usuario:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al actualizar información del usuario"
    );
  }
};

/**
 * Obtiene cupones disponibles para un usuario específico
 * @param {string} userId_ahga - ID del usuario
 * @returns {Promise<Array>} Array de cupones disponibles
 */
export const obtenerCuponesUsuario_ahga = async (userId_ahga) => {
  try {
    const q_ahga = query(
      collection(db_ahga, "cupones"),
      where("userId", "==", userId_ahga),
      where("usado", "==", false),
      where("activo", "==", true)
    );

    const querySnapshot_ahga = await getDocs(q_ahga);
    const cupones_ahga = [];

    querySnapshot_ahga.forEach((doc_ahga) => {
      const cuponData_ahga = doc_ahga.data();
      const fechaVencimiento_ahga = new Date(cuponData_ahga.fechaVencimiento);
      const ahora_ahga = new Date();

      // Solo incluir cupones que no hayan vencido
      if (fechaVencimiento_ahga > ahora_ahga) {
        cupones_ahga.push({
          id: doc_ahga.id,
          ...cuponData_ahga,
        });
      }
    });

    return cupones_ahga;
  } catch (error_ahga) {
    console.error("Error al obtener cupones del usuario:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener cupones disponibles"
    );
  }
};

/**
 * Valida un cupón por código
 * @param {string} codigo_ahga - Código del cupón
 * @param {string} userId_ahga - ID del usuario (opcional)
 * @returns {Promise<Object|null>} Datos del cupón si es válido, null si no
 */
export const validarCuponFirebase_ahga = async (
  codigo_ahga,
  userId_ahga = null
) => {
  try {
    let q_ahga;

    if (userId_ahga) {
      q_ahga = query(
        collection(db_ahga, "cupones"),
        where("codigo", "==", codigo_ahga),
        where("userId", "==", userId_ahga),
        where("usado", "==", false),
        where("activo", "==", true)
      );
    } else {
      q_ahga = query(
        collection(db_ahga, "cupones"),
        where("codigo", "==", codigo_ahga),
        where("usado", "==", false),
        where("activo", "==", true)
      );
    }

    const querySnapshot_ahga = await getDocs(q_ahga);

    if (querySnapshot_ahga.empty) {
      return null;
    }

    const doc_ahga = querySnapshot_ahga.docs[0];
    const cuponData_ahga = doc_ahga.data();
    const fechaVencimiento_ahga = new Date(cuponData_ahga.fechaVencimiento);
    const ahora_ahga = new Date();

    // Verificar si el cupón ha vencido
    if (fechaVencimiento_ahga <= ahora_ahga) {
      return null;
    }

    // Los cupones de bienvenida no tienen monto mínimo

    return {
      id: doc_ahga.id,
      ...cuponData_ahga,
    };
  } catch (error_ahga) {
    console.error("Error al validar cupón:", error_ahga);
    throw createFriendlyError_ahga(error_ahga, "Error al validar el cupón");
  }
};

/**
 * Marca un cupón como usado
 * @param {string} cuponId_ahga - ID del cupón
 * @returns {Promise<void>}
 */
export const marcarCuponUsado_ahga = async (cuponId_ahga) => {
  try {
    const docRef_ahga = doc(db_ahga, "cupones", cuponId_ahga);
    await updateDoc(docRef_ahga, {
      usado: true,
      fechaUso: new Date().toISOString(),
    });
    console.log("Cupón marcado como usado");
  } catch (error_ahga) {
    console.error("Error al marcar cupón como usado:", error_ahga);
    throw createFriendlyError_ahga(error_ahga, "Error al procesar el cupón");
  }
};
