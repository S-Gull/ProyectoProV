/**
 * Servicio para operaciones con Firestore
 * Maneja todas las interacciones con la base de datos
 */

import { doc, setDoc, getDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

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
    throw createFriendlyError_ahga(error_ahga, "Error al guardar productos en la base de datos");
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
    throw createFriendlyError_ahga(error_ahga, "Error al obtener información del producto");
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
    throw createFriendlyError_ahga(error_ahga, "Error al cargar la lista de productos");
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
    throw createFriendlyError_ahga(error_ahga, "Error al obtener información del usuario");
  }
};