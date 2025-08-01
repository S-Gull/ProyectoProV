/**
 * Componente de UI para autenticación
 * Maneja la interacción del usuario con los formularios de login y registro
 */

import {
  registrarUsuario_ahga,
  iniciarSesion_ahga,
} from "../services/auth.service.js";
import {
  validateUserRegistration_ahga,
  validateLogin_ahga,
} from "../utils/validators.js";
import { createCaptcha_ahga, validateCaptcha_ahga } from "../utils/captcha.js";

/**
 * Muestra un modal por su ID
 * @param {string} modalId - ID del modal a mostrar
 */
export const showModal_ahga = (modalId_ahga) => {
  document.getElementById(modalId_ahga).classList.remove("hidden");
};

/**
 * Oculta un modal por su ID
 * @param {string} modalId - ID del modal a ocultar
 */
export const hideModal_ahga = (modalId_ahga) => {
  document.getElementById(modalId_ahga).classList.add("hidden");
};

/**
 * Configura los eventos para cerrar modales
 */
export const setupModalCloseEvents_ahga = () => {
  // Modal de éxito de inicio de sesión
  document
    .getElementById("cerrar-login-success")
    .addEventListener("click", () => {
      hideModal_ahga("modal-login-success");
      location.href = "./juego.html";
    });

  // Modal de error de inicio de sesión
  document
    .getElementById("cerrar-login-error")
    .addEventListener("click", () => {
      hideModal_ahga("modal-login-error");
    });

  // Modal de éxito de registro
  document
    .getElementById("cerrar-register-success")
    .addEventListener("click", () => {
      hideModal_ahga("modal-register-success");
      document.getElementById("showLogin").click();
      document.querySelector("#registerForm form").reset();
    });

  // Modal de error de registro
  document
    .getElementById("cerrar-register-error")
    .addEventListener("click", () => {
      hideModal_ahga("modal-register-error");
    });

  // Modal de error de validación
  document
    .getElementById("cerrar-validation-error")
    .addEventListener("click", () => {
      hideModal_ahga("modal-validation-error");
    });
};

/**
 * Configura los eventos para cambiar entre formularios de login y registro
 */
export const setupFormSwitchEvents_ahga = () => {
  // Mostrar formulario de registro
  document
    .getElementById("showRegister")
    .addEventListener("click", (e_ahga) => {
      e_ahga.preventDefault();
      document.getElementById("loginForm").classList.add("hidden");
      document.getElementById("registerForm").classList.remove("hidden");
    });

  // Mostrar formulario de login
  document.getElementById("showLogin").addEventListener("click", (e_ahga) => {
    e_ahga.preventDefault();
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
  });
};

/**
 * Configura el evento de envío del formulario de login
 */
export const setupLoginForm_ahga = () => {
  document
    .querySelector("#loginForm form")
    .addEventListener("submit", async (e_ahga) => {
      e_ahga.preventDefault();

      const email_ahga = document.getElementById("email").value;
      const password_ahga = document.getElementById("password").value;

      // Validar CAPTCHA
      if (
        !validateCaptcha_ahga("login-captcha-container", "login-captcha-input")
      ) {
        document.getElementById("validation-error-message").textContent =
          "⚠️ El código CAPTCHA es incorrecto. Por favor, inténtelo de nuevo.";
        showModal_ahga("modal-validation-error");
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga("login-captcha-container", "login-captcha-input");
        return;
      }

      // Validar datos antes de enviar
      const validation_ahga = await validateLogin_ahga({
        email: email_ahga,
        password: password_ahga,
      });
      if (!validation_ahga.isValid) {
        document.getElementById(
          "validation-error-message"
        ).textContent = `⚠️ ${validation_ahga.errorMessage}`;
        showModal_ahga("modal-validation-error");
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga("login-captcha-container", "login-captcha-input");
        return;
      }

      // Mostrar advertencia si la contraseña ha sido comprometida
      if (validation_ahga.warningMessage) {
        document.getElementById(
          "validation-error-message"
        ).textContent = `⚠️ ${validation_ahga.warningMessage}`;
        showModal_ahga("modal-validation-error");
        // No regeneramos el CAPTCHA ya que es solo una advertencia
      }

      try {
        await iniciarSesion_ahga(email_ahga, password_ahga);
        showModal_ahga("modal-login-success");
      } catch (error_ahga) {
        document.getElementById("login-error-message").textContent =
          error_ahga.message;
        showModal_ahga("modal-login-error");
        console.error("Error detallado:", error_ahga);
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga("login-captcha-container", "login-captcha-input");
      }
    });
};

/**
 * Configura el evento de envío del formulario de registro
 */
export const setupRegisterForm_ahga = () => {
  document
    .querySelector("#registerForm form")
    .addEventListener("submit", async (e_ahga) => {
      e_ahga.preventDefault();

      // Recopilar datos del formulario
      const email_ahga = document.getElementById("regEmail").value;
      const password_ahga = document.getElementById("regPassword").value;
      const confirmPassword_ahga =
        document.getElementById("confirmPassword").value;
      const firstName_ahga = document.getElementById("firstName").value;
      const lastName_ahga = document.getElementById("lastName").value;
      const username_ahga = document.getElementById("username").value;
      const birthDate_ahga = document.getElementById("birthDate").value;
      const tipoCedula_ahga = document.getElementById("tipoCedula").value;
      const numeroCedula_ahga = document.getElementById("numeroCedula").value;
      const codigoTelefono_ahga =
        document.getElementById("codigoTelefono").value;
      const numeroTelefono_ahga =
        document.getElementById("numeroTelefono").value;
      const direccion_ahga = document.getElementById("direccion").value;
      const codigoPostal_ahga = document.getElementById("codigoPostal").value;
      const acceptTerms_ahga = document.getElementById("terms").checked;

      // Validar CAPTCHA
      if (
        !validateCaptcha_ahga(
          "register-captcha-container",
          "register-captcha-input"
        )
      ) {
        document.getElementById("validation-error-message").textContent =
          "⚠️ El código CAPTCHA es incorrecto. Por favor, inténtelo de nuevo.";
        showModal_ahga("modal-validation-error");
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga(
          "register-captcha-container",
          "register-captcha-input"
        );
        return;
      }

      // Validar datos antes de enviar
      const validation_ahga = await validateUserRegistration_ahga({
        email: email_ahga,
        password: password_ahga,
        confirmPassword: confirmPassword_ahga,
        username: username_ahga,
        firstName: firstName_ahga,
        lastName: lastName_ahga,
      });

      if (!validation_ahga.isValid) {
        document.getElementById(
          "validation-error-message"
        ).textContent = `⚠️ ${validation_ahga.errorMessage}`;
        showModal_ahga("modal-validation-error");
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga(
          "register-captcha-container",
          "register-captcha-input"
        );
        return;
      }

      if (!acceptTerms_ahga) {
        document.getElementById("validation-error-message").textContent =
          "⚠️ Debes aceptar los términos y condiciones.";
        showModal_ahga("modal-validation-error");
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga(
          "register-captcha-container",
          "register-captcha-input"
        );
        return;
      }

      // Estructurar datos adicionales
      const cedula_ahga = {
        tipo: tipoCedula_ahga,
        numero: numeroCedula_ahga,
      };

      const telefono_ahga = {
        codigo: codigoTelefono_ahga,
        numero: numeroTelefono_ahga,
      };

      try {
        await registrarUsuario_ahga(email_ahga, password_ahga, {
          nombre: firstName_ahga,
          apellido: lastName_ahga,
          username: username_ahga,
          fecha_nacimiento: birthDate_ahga,
          cedula: cedula_ahga,
          telefono: telefono_ahga,
          direccion: direccion_ahga,
          codigo_postal: codigoPostal_ahga,
          rol: "usuario",
        });

        showModal_ahga("modal-register-success");
      } catch (error_ahga) {
        document.getElementById(
          "register-error-message"
        ).textContent = `❌ ${error_ahga.message}`;
        showModal_ahga("modal-register-error");
        console.error("Error completo:", error_ahga);
        // Regenerar CAPTCHA después de un intento fallido
        createCaptcha_ahga(
          "register-captcha-container",
          "register-captcha-input"
        );
      }
    });
};

/**
 * Inicializa los CAPTCHAs en los formularios
 */
export const setupCaptchas_ahga = () => {
  // Agregar contenedores para los CAPTCHAs si no existen
  const loginForm_ahga = document.querySelector("#loginForm form");
  if (loginForm_ahga) {
    // Verificar si ya existe el contenedor del CAPTCHA
    if (!document.getElementById("login-captcha-container")) {
      const captchaDiv_ahga = document.createElement("div");
      captchaDiv_ahga.id = "login-captcha-container";
      captchaDiv_ahga.className = "form-group";

      // Insertar antes del botón de envío
      const submitButton_ahga = loginForm_ahga.querySelector(
        "button[type='submit']"
      );
      loginForm_ahga.insertBefore(captchaDiv_ahga, submitButton_ahga);

      // Inicializar el CAPTCHA
      createCaptcha_ahga("login-captcha-container", "login-captcha-input");
    }
  }

  const registerForm_ahga = document.querySelector("#registerForm form");
  if (registerForm_ahga) {
    // Verificar si ya existe el contenedor del CAPTCHA
    if (!document.getElementById("register-captcha-container")) {
      const captchaDiv_ahga = document.createElement("div");
      captchaDiv_ahga.id = "register-captcha-container";
      captchaDiv_ahga.className = "form-group";

      // Insertar antes del botón de envío
      const submitButton_ahga = registerForm_ahga.querySelector(
        "button[type='submit']"
      );
      registerForm_ahga.insertBefore(captchaDiv_ahga, submitButton_ahga);

      // Inicializar el CAPTCHA
      createCaptcha_ahga(
        "register-captcha-container",
        "register-captcha-input"
      );
    }
  }
};

/**
 * Configura el modal de política de contraseñas y el generador de contraseñas
 */
export const setupPasswordPolicyUI_ahga = () => {
  // Crear modal de política de contraseñas si no existe
  if (!document.getElementById("modal-password-policy")) {
    const modalHTML_ahga = `
      
      <div id="modal-password-policy" class="modal hidden">
        <div class="modal-content">
          <h2>Política de Contraseñas</h2>
          <div id="password-policy-content">
            <p>Para garantizar la seguridad de tu cuenta, tu contraseña debe:</p>
            <ul>
              <li>Tener al menos 8 caracteres</li>
              <li>Incluir al menos una letra minúscula</li>
              <li>Incluir al menos una letra mayúscula</li>
              <li>Incluir al menos un número</li>
              <li>Incluir al menos un carácter especial</li>
              <li>No ser una contraseña común o comprometida</li>
              <li>No contener secuencias obvias (123, abc)</li>
              <li>No contener caracteres repetidos consecutivos</li>
            </ul>
          </div>
          <div class="password-generator">
            <h3>Generador de Contraseñas Seguras</h3>
            <div class="generator-controls">
              <button id="generate-password" class="btn btn-primary">Generar Contraseña Segura</button>
              <div id="generated-password-container" class="hidden">
                <input type="text" id="generated-password" readonly />
                <button id="copy-password" class="btn btn-secondary">Copiar</button>
                <button id="use-password" class="btn btn-success">Usar</button>
              </div>
            </div>
          </div>
          <button id="cerrar-password-policy" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    `;

    // Añadir el modal al DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML_ahga);

    // Configurar eventos
    document
      .getElementById("cerrar-password-policy")
      .addEventListener("click", () => {
        hideModal_ahga("modal-password-policy");
      });

    // Evento para generar contraseña
    document
      .getElementById("generate-password")
      .addEventListener("click", async () => {
        try {
          // Importar dinámicamente el módulo de política de contraseñas
          const passwordPolicyModule = await import(
            "../utils/password-policy.js"
          );
          const generatedPassword =
            passwordPolicyModule.generateSecurePassword_ahga();

          // Mostrar la contraseña generada
          document.getElementById("generated-password").value =
            generatedPassword;
          document
            .getElementById("generated-password-container")
            .classList.remove("hidden");
        } catch (error) {
          console.error("Error al generar contraseña:", error);
          // Fallback si no se puede cargar el módulo
          const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
          let password = "";
          for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          document.getElementById("generated-password").value = password;
          document
            .getElementById("generated-password-container")
            .classList.remove("hidden");
        }
      });

    // Evento para copiar contraseña
    document.getElementById("copy-password").addEventListener("click", () => {
      const passwordField = document.getElementById("generated-password");
      passwordField.select();
      document.execCommand("copy");
      alert("Contraseña copiada al portapapeles");
    });

    // Evento para usar la contraseña generada
    document.getElementById("use-password").addEventListener("click", () => {
      const generatedPassword =
        document.getElementById("generated-password").value;

      // Determinar en qué formulario estamos
      if (
        !document.getElementById("registerForm").classList.contains("hidden")
      ) {
        // Estamos en el formulario de registro
        document.getElementById("regPassword").value = generatedPassword;
        document.getElementById("confirmPassword").value = generatedPassword;
      } else {
        // Estamos en el formulario de login
        document.getElementById("password").value = generatedPassword;
      }

      hideModal_ahga("modal-password-policy");
    });
  }

  // Añadir enlaces para mostrar la política de contraseñas
  const addPasswordPolicyLink = (formId, inputId) => {
    const passwordField = document.getElementById(inputId);
    if (passwordField) {
      const policyLink = document.createElement("a");
      policyLink.href = "#";
      policyLink.className = "password-policy-link";
      policyLink.textContent = "Ver política de contraseñas";
      policyLink.addEventListener("click", (e) => {
        e.preventDefault();
        showModal_ahga("modal-password-policy");
      });

      // Insertar después del campo de contraseña
      passwordField.parentNode.insertBefore(
        policyLink,
        passwordField.nextSibling
      );
    }
  };

  // Añadir enlaces a los formularios
  addPasswordPolicyLink("loginForm", "password");
  addPasswordPolicyLink("registerForm", "regPassword");
};

/**
 * Inicializa todos los componentes de UI para autenticación
 */
export const initAuthUI_ahga = () => {
  setupModalCloseEvents_ahga();
  setupFormSwitchEvents_ahga();
  setupLoginForm_ahga();
  setupRegisterForm_ahga();
  setupCaptchas_ahga();
  setupPasswordPolicyUI_ahga();

  // Inicializar el temporizador de sesión
  try {
    import("../utils/session-timer.js")
      .then((module) => {
        module.initSessionTimer_ahga();
      })
      .catch((error) => {
        console.error("Error al inicializar el temporizador de sesión:", error);
      });
  } catch (error) {
    console.error(
      "Error al cargar el módulo de temporizador de sesión:",
      error
    );
  }

  console.log("Componentes de autenticación inicializados");
};

// Inicializar automáticamente si estamos en la página de login
if (
  document.getElementById("loginForm") &&
  document.getElementById("registerForm")
) {
  document.addEventListener("DOMContentLoaded", initAuthUI_ahga);
}
