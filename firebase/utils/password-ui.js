/**
 * Utilidades para la interfaz de usuario de contraseñas
 * Incluye funciones para mostrar/ocultar contraseñas y validación visual
 */

// Importar utilidades de políticas de contraseña
import {
  validatePasswordPolicy_ahga,
  PASSWORD_POLICY_ahga,
} from "./password-policy.js";

/**
 * Funcionalidad para mostrar/ocultar contraseñas
 * @param {string} inputId - ID del campo de contraseña
 * @param {string} buttonId - ID del botón toggle
 * @param {string} iconId - ID del icono
 */
export function configurarTogglePassword_ahga(inputId, buttonId, iconId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const icon = document.getElementById(iconId);

  if (input && button && icon) {
    button.addEventListener("click", () => {
      const isPassword = input.type === "password";

      // Cambiar tipo de input
      input.type = isPassword ? "text" : "password";

      // Cambiar icono
      icon.className = isPassword ? "fas fa-eye-slash" : "fas fa-eye";
    });
  }
}

/**
 * Mostrar políticas de contraseñas
 * @param {string} containerId - ID del contenedor donde mostrar las políticas
 */
export function mostrarPoliticasPassword_ahga(containerId) {
  const politicasContainer = document.getElementById(containerId);
  if (!politicasContainer) return;

  const politicas = [
    `Mínimo ${PASSWORD_POLICY_ahga.minLength} caracteres`,
    "Al menos una letra minúscula (a-z)",
    "Al menos una letra mayúscula (A-Z)",
    "Al menos un número (0-9)",
    "Al menos un carácter especial (!@#$%^&*)",
  ];

  politicasContainer.innerHTML = `
    <div class="text-xs text-[#b8b3ba] mt-2">
      <p class="font-medium mb-1">Requisitos de contraseña:</p>
      <ul class="space-y-1">
        ${politicas.map((politica) => `<li>• ${politica}</li>`).join("")}
      </ul>
    </div>
  `;
}

/**
 * Validar contraseña en tiempo real con indicadores visuales
 * @param {string} password - Contraseña a validar
 * @param {string} containerId - ID del contenedor donde mostrar la validación
 * @returns {Object} Resultado de la validación
 */
export function validarPasswordEnTiempoReal_ahga(password, containerId) {
  const validacion = validatePasswordPolicy_ahga(password);
  const politicasContainer = document.getElementById(containerId);

  if (!politicasContainer) return validacion;

  const politicas = [
    {
      texto: `Mínimo ${PASSWORD_POLICY_ahga.minLength} caracteres`,
      valido: password.length >= PASSWORD_POLICY_ahga.minLength,
    },
    {
      texto: "Al menos una letra minúscula (a-z)",
      valido: /[a-z]/.test(password),
    },
    {
      texto: "Al menos una letra mayúscula (A-Z)",
      valido: /[A-Z]/.test(password),
    },
    { texto: "Al menos un número (0-9)", valido: /[0-9]/.test(password) },
    {
      texto: "Al menos un carácter especial (!@#$%^&*)",
      valido: /[^A-Za-z0-9]/.test(password),
    },
  ];

  politicasContainer.innerHTML = `
    <div class="text-xs mt-2">
      <p class="font-medium mb-1 text-[#b8b3ba]">Requisitos de contraseña:</p>
      <ul class="space-y-1">
        ${politicas
          .map(
            (politica) => `
          <li class="flex items-center space-x-2">
            <span class="${
              politica.valido ? "text-green-400" : "text-red-400"
            }">
              ${politica.valido ? "✓" : "✗"}
            </span>
            <span class="${
              politica.valido ? "text-green-400" : "text-[#b8b3ba]"
            }">
              ${politica.texto}
            </span>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;

  return validacion;
}

/**
 * Configurar validación de contraseña para un campo específico
 * @param {string} inputId - ID del campo de contraseña
 * @param {string} containerId - ID del contenedor de validación
 */
export function configurarValidacionPassword_ahga(inputId, containerId) {
  const passwordInput = document.getElementById(inputId);
  if (passwordInput) {
    passwordInput.addEventListener("focus", () => {
      mostrarPoliticasPassword_ahga(containerId);
    });

    passwordInput.addEventListener("input", (e) => {
      if (e.target.value.length > 0) {
        validarPasswordEnTiempoReal_ahga(e.target.value, containerId);
      } else {
        mostrarPoliticasPassword_ahga(containerId);
      }
    });

    passwordInput.addEventListener("blur", (e) => {
      if (e.target.value.length === 0) {
        document.getElementById(containerId).innerHTML = "";
      }
    });
  }
}

/**
 * Inicializar todas las funcionalidades de UI de contraseñas
 * Función de conveniencia para configurar todo de una vez
 */
export function inicializarPasswordUI_ahga() {
  // Configurar iconos de mostrar/ocultar contraseña
  configurarTogglePassword_ahga("password", "togglePassword", "iconPassword");
  configurarTogglePassword_ahga(
    "regPassword",
    "toggleRegPassword",
    "iconRegPassword"
  );
  configurarTogglePassword_ahga(
    "confirmPassword",
    "toggleConfirmPassword",
    "iconConfirmPassword"
  );

  // Configurar validación de políticas de contraseña
  configurarValidacionPassword_ahga("password", "politicasPasswordLogin_ahga");
  configurarValidacionPassword_ahga(
    "regPassword",
    "politicasPasswordRegistro_ahga"
  );
}