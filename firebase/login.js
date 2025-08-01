// js/login.js
import { registrarUsuario, iniciarSesion } from "./auth.js";

// Funciones auxiliares para manejar modales
const showModal = (modalId) => {
  document.getElementById(modalId).classList.remove("hidden");
  console.log(modalId);
};

const hideModal = (modalId) => {
  document.getElementById(modalId).classList.add("hidden");
};

// Configurar eventos para cerrar modales
const setupModalCloseEvents = () => {
  // Modal de éxito login
  document
    .getElementById("cerrar-login-success")
    .addEventListener("click", () => {
      hideModal("modal-login-success");
      window.location.href = "index.html";
    });

  // Modal de error login
  document
    .getElementById("cerrar-login-error")
    .addEventListener("click", () => {
      hideModal("modal-login-error");
    });

  // Modal de éxito registro
  document
    .getElementById("cerrar-register-success")
    .addEventListener("click", () => {
      hideModal("modal-register-success");
      document.getElementById("showLogin").click();
      document.querySelector("#registerForm form").reset();
    });

  // Modal de error registro
  document
    .getElementById("cerrar-register-error")
    .addEventListener("click", () => {
      hideModal("modal-register-error");
    });

  // Modal de validación
  document
    .getElementById("cerrar-validation-error")
    .addEventListener("click", () => {
      hideModal("modal-validation-error");
    });
};

// Inicializar eventos de cierre de modales
setupModalCloseEvents();

// Alternar entre formularios (sin cambios)
document.getElementById("showRegister").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
});

// Manejador del login (actualizado con modales)
document
  .querySelector("#loginForm form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await iniciarSesion(email, password);
      showModal("modal-login-success");
    } catch (error) {
      document.getElementById("login-error-message").textContent =
        error.message;
      showModal("modal-login-error");
      console.error("Error detallado:", error);
    }
  });

// Manejador del registro (actualizado con modales)
document
  .querySelector("#registerForm form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const birthDate = document.getElementById("birthDate").value;
    const acceptTerms = document.getElementById("terms").checked;

    // Validaciones con modales
    if (password !== confirmPassword) {
      document.getElementById("validation-error-message").textContent =
        "⚠️ Las contraseñas no coinciden.";
      showModal("modal-validation-error");
      return;
    }

    if (!acceptTerms) {
      document.getElementById("validation-error-message").textContent =
        "⚠️ Debes aceptar los términos y condiciones.";
      showModal("modal-validation-error");
      return;
    }

    try {
      await registrarUsuario(email, password, {
        nombre: firstName,
        apellido: lastName,
        username: username,
        fecha_nacimiento: birthDate,
        rol: "usuario",
      });

      showModal("modal-register-success");
    } catch (error) {
      document.getElementById(
        "register-error-message"
      ).textContent = `❌ ${error.message}`;
      showModal("modal-register-error");
      console.error("Error completo:", error);
    }
  });
