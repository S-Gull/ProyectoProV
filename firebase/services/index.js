/**
 * Punto de entrada principal para los servicios de Firebase
 * Inicializa Firebase y exporta las instancias necesarias
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { firebaseConfig_ahga } from "../config/firebase.config.js";

// Inicializar la aplicación Firebase
const app_ahga = initializeApp(firebaseConfig_ahga);

// Obtener instancias de servicios
const auth_ahga = getAuth(app_ahga);
const db_ahga = getFirestore(app_ahga);

// Exportar las instancias para uso en otros módulos
export { auth_ahga, db_ahga };

// Exportar servicios específicos
export * from "./auth.service.js";
export * from "./firestore.service.js";