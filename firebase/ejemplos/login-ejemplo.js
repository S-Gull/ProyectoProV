/**
 * Ejemplo de uso de la nueva estructura de Firebase en la página de login
 * Este archivo muestra cómo se integraría la nueva estructura en la página existente
 */

// Importar solo lo que necesitamos de la nueva estructura
import { initAuthUI_ahga } from "../ui/auth-ui.js";

// Inicializar la interfaz de usuario de autenticación
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar componentes de autenticación
  initAuthUI_ahga();
  
  console.log("Página de login inicializada con la nueva estructura");
});