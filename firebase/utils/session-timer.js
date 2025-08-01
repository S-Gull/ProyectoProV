/**
 * Utilidad para gestionar el tiempo de sesión del usuario
 * Implementa un temporizador que cierra la sesión automáticamente después de un período de inactividad
 */

import { cerrarSesion_ahga } from "../services/auth.service.js";

// Configuración del temporizador
const SESSION_TIMEOUT_MS_ahga = 30 * 60 * 1000; // 30 minutos por defecto
let sessionTimer_ahga = null;
let warningTimer_ahga = null;
let warningShown_ahga = false;
let originalTimeout_ahga = SESSION_TIMEOUT_MS_ahga;

/**
 * Inicia el temporizador de sesión
 * @param {number} timeoutMs - Tiempo en milisegundos antes de cerrar la sesión (opcional)
 */
export const startSessionTimer_ahga = (timeoutMs_ahga = SESSION_TIMEOUT_MS_ahga) => {
  // Guardar el timeout original
  originalTimeout_ahga = timeoutMs_ahga;
  
  // Limpiar temporizadores existentes
  if (sessionTimer_ahga) clearTimeout(sessionTimer_ahga);
  if (warningTimer_ahga) clearTimeout(warningTimer_ahga);
  
  // Configurar el temporizador de advertencia (2 minutos antes)
  warningTimer_ahga = setTimeout(() => {
    showSessionWarning_ahga();
  }, timeoutMs_ahga - (2 * 60 * 1000));
  
  // Configurar el temporizador principal
  sessionTimer_ahga = setTimeout(async () => {
    try {
      await cerrarSesion_ahga();
      showSessionExpiredMessage_ahga();
    } catch (error_ahga) {
      console.error("Error al cerrar sesión automáticamente:", error_ahga);
    }
  }, timeoutMs_ahga);
  
  // Reiniciar la bandera de advertencia
  warningShown_ahga = false;
};

/**
 * Reinicia el temporizador de sesión (por ejemplo, cuando el usuario realiza una acción)
 */
export const resetSessionTimer_ahga = () => {
  // Si se mostró una advertencia, ocultarla
  if (warningShown_ahga) {
    hideSessionWarning_ahga();
  }
  
  // Reiniciar el temporizador
  startSessionTimer_ahga(originalTimeout_ahga);
};

/**
 * Detiene el temporizador de sesión (por ejemplo, cuando el usuario cierra sesión manualmente)
 */
export const stopSessionTimer_ahga = () => {
  if (sessionTimer_ahga) {
    clearTimeout(sessionTimer_ahga);
    sessionTimer_ahga = null;
  }
  
  if (warningTimer_ahga) {
    clearTimeout(warningTimer_ahga);
    warningTimer_ahga = null;
  }
  
  // Si se mostró una advertencia, ocultarla
  if (warningShown_ahga) {
    hideSessionWarning_ahga();
  }
};

/**
 * Muestra una advertencia de que la sesión está por expirar
 */
const showSessionWarning_ahga = () => {
  warningShown_ahga = true;
  
  // Crear el elemento de advertencia si no existe
  if (!document.getElementById("session-warning")) {
    const warningDiv_ahga = document.createElement("div");
    warningDiv_ahga.id = "session-warning";
    warningDiv_ahga.className = "session-warning";
    warningDiv_ahga.innerHTML = `
      <div class="session-warning-content">
        <h3>¡Advertencia de sesión!</h3>
        <p>Su sesión está a punto de expirar en 2 minutos debido a inactividad.</p>
        <button id="extend-session-btn" class="btn btn-primary">Extender sesión</button>
      </div>
    `;
    
    // Agregar estilos CSS
    if (!document.getElementById("session-timer-styles")) {
      const style_ahga = document.createElement("style");
      style_ahga.id = "session-timer-styles";
      style_ahga.textContent = `
        .session-warning {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          padding: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 9999;
          animation: slide-in 0.3s ease-out;
        }
        
        .session-warning-content h3 {
          color: #721c24;
          margin-top: 0;
        }
        
        .session-warning-content p {
          margin-bottom: 15px;
        }
        
        .session-expired {
          background-color: #f8d7da;
          border-color: #f5c6cb;
          color: #721c24;
        }
        
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style_ahga);
    }
    
    document.body.appendChild(warningDiv_ahga);
    
    // Agregar evento al botón de extender sesión
    document.getElementById("extend-session-btn").addEventListener("click", () => {
      resetSessionTimer_ahga();
    });
  } else {
    // Si ya existe, mostrar
    document.getElementById("session-warning").style.display = "block";
  }
};

/**
 * Oculta la advertencia de sesión
 */
const hideSessionWarning_ahga = () => {
  const warningElement_ahga = document.getElementById("session-warning");
  if (warningElement_ahga) {
    warningElement_ahga.style.display = "none";
  }
  warningShown_ahga = false;
};

/**
 * Muestra un mensaje de que la sesión ha expirado
 */
const showSessionExpiredMessage_ahga = () => {
  // Crear el elemento de mensaje si no existe
  if (!document.getElementById("session-expired")) {
    const expiredDiv_ahga = document.createElement("div");
    expiredDiv_ahga.id = "session-expired";
    expiredDiv_ahga.className = "session-warning session-expired";
    expiredDiv_ahga.innerHTML = `
      <div class="session-warning-content">
        <h3>Sesión expirada</h3>
        <p>Su sesión ha expirado debido a inactividad. Por favor, inicie sesión nuevamente.</p>
        <button id="login-again-btn" class="btn btn-primary">Iniciar sesión</button>
      </div>
    `;
    
    document.body.appendChild(expiredDiv_ahga);
    
    // Agregar evento al botón de iniciar sesión
    document.getElementById("login-again-btn").addEventListener("click", () => {
      window.location.href = "login.html";
    });
  } else {
    // Si ya existe, mostrar
    document.getElementById("session-expired").style.display = "block";
  }
};

/**
 * Configura los eventos de actividad del usuario para reiniciar el temporizador
 */
export const setupUserActivityTracking_ahga = () => {
  // Lista de eventos que indican actividad del usuario
  const activityEvents_ahga = [
    "mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"
  ];
  
  // Agregar listeners para cada evento
  activityEvents_ahga.forEach(eventType_ahga => {
    document.addEventListener(eventType_ahga, () => {
      resetSessionTimer_ahga();
    }, { passive: true });
  });
};

/**
 * Inicializa el sistema de temporizador de sesión
 * @param {number} timeoutMs - Tiempo en milisegundos antes de cerrar la sesión (opcional)
 */
export const initSessionTimer_ahga = (timeoutMs_ahga = SESSION_TIMEOUT_MS_ahga) => {
  // Iniciar el temporizador
  startSessionTimer_ahga(timeoutMs_ahga);
  
  // Configurar el seguimiento de actividad del usuario
  setupUserActivityTracking_ahga();
  
  console.log(`Temporizador de sesión iniciado (${timeoutMs_ahga / 60000} minutos)`);
};