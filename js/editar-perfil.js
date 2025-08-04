import {
  validatePasswordPolicy_ahga,
  PASSWORD_POLICY_ahga,
} from "../firebase/utils/password-policy.js";

// Editar Perfil - Funcionalidad
class EditarPerfil_AHGA {
  constructor() {
    this.datosUsuario = null;
    this.nuevaImagenAvatar = undefined;
    this.imageUploadService = null;
    this.init();
  }

  // Mostrar políticas de contraseñas
  mostrarPoliticasPassword() {
    const politicasContainer = document.getElementById(
      "politicasPassword_ahga"
    );
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

  // Validar contraseña en tiempo real
  validarPasswordEnTiempoReal(password) {
    const validacion = validatePasswordPolicy_ahga(password);
    const politicasContainer = document.getElementById(
      "politicasPassword_ahga"
    );

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

  // Mostrar notificación visual
  mostrarNotificacion(mensaje, tipo = "success") {
    const container = document.getElementById("notificacionesContainer_ahga");
    if (!container) return;

    const notificacion = document.createElement("div");
    const iconos = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };

    const colores = {
      success: "bg-green-500 border-green-600",
      error: "bg-red-500 border-red-600",
      warning: "bg-yellow-500 border-yellow-600",
      info: "bg-blue-500 border-blue-600",
    };

    notificacion.className = `${colores[tipo]} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 transform translate-x-full transition-transform duration-300 ease-in-out max-w-sm`;

    notificacion.innerHTML = `
      <div class="flex items-center space-x-3">
        <i class="${iconos[tipo]} text-xl"></i>
        <div class="flex-1">
          <p class="font-medium">${mensaje}</p>
        </div>
        <button class="text-white hover:text-gray-200 transition-colors" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    container.appendChild(notificacion);

    // Animar entrada
    setTimeout(() => {
      notificacion.classList.remove("translate-x-full");
    }, 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.classList.add("translate-x-full");
        setTimeout(() => {
          if (notificacion.parentElement) {
            notificacion.remove();
          }
        }, 300);
      }
    }, 5000);
  }

  async init() {
    await this.cargarDatosUsuario();
    this.initImageService();
    this.configurarEventos();
    this.llenarFormulario();
  }

  // Inicializar servicio de imágenes
  initImageService() {
    // Usar el servicio global si está disponible
    this.imageUploadService = window.ImageUploadService_AHGA || null;
    if (!this.imageUploadService) {
      console.warn("⚠️ Servicio de imágenes no disponible");
    }
  }

  // Cargar datos del usuario
  async cargarDatosUsuario() {
    try {
      // Intentar obtener datos del sessionStorage
      const datosSession = sessionStorage.getItem("datosUsuario_ahga");
      if (datosSession) {
        this.datosUsuario = JSON.parse(datosSession);
        return;
      }

      // Si no hay datos en session, redirigir al login
      this.mostrarNotificacion(
        "🔑 Debes iniciar sesión para editar tu perfil",
        "warning"
      );
      setTimeout(() => {
        window.location.href = "/dist/login.html";
      }, 2000);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
      this.mostrarNotificacion(
        "❌ Error al cargar los datos del usuario",
        "error"
      );
    }
  }

  // Llenar formulario con datos actuales
  llenarFormulario() {
    if (!this.datosUsuario) return;

    const elementos = {
      nombre: document.getElementById("nombre_ahga"),
      username: document.getElementById("username_ahga"),
      email: document.getElementById("email_ahga"),
      telefono: document.getElementById("telefono_ahga"),
      fechaNacimiento: document.getElementById("fechaNacimiento_ahga"),
      avatarDragDrop: document.getElementById("avatarDragDrop_ahga"),
    };

    // Llenar campos
    if (elementos.nombre)
      elementos.nombre.value = this.datosUsuario.nombre || "";
    if (elementos.username)
      elementos.username.value =
        this.datosUsuario.username || this.datosUsuario.nombreUsuario || "";
    if (elementos.email) elementos.email.value = this.datosUsuario.email || "";
    if (elementos.telefono)
      elementos.telefono.value = this.datosUsuario.telefono || "";
    if (elementos.fechaNacimiento) {
      // Verificar ambos posibles nombres de campo para compatibilidad
      const fechaNacimiento =
        this.datosUsuario.fechaNacimiento ||
        this.datosUsuario.fecha_nacimiento ||
        "";
      elementos.fechaNacimiento.value = fechaNacimiento;
    }

    // Actualizar avatar en el componente drag-drop
    if (elementos.avatarDragDrop) {
      const nombreMostrar =
        this.datosUsuario.nombre || this.datosUsuario.email.split("@")[0];
      const avatarUrl = this.datosUsuario.avatar || "../img/default-avatar.svg";
      elementos.avatarDragDrop.setImage(avatarUrl);
    }
  }

  // Configurar eventos
  configurarEventos() {
    // Formulario principal
    const formulario = document.getElementById("formularioEditarPerfil_ahga");
    if (formulario) {
      formulario.addEventListener("submit", (e) => this.guardarCambios(e));
    }

    // Formulario de cambio de contraseña
    const formularioPassword = document.getElementById(
      "formularioCambiarPassword_ahga"
    );
    if (formularioPassword) {
      formularioPassword.addEventListener("submit", (e) =>
        this.cambiarPassword(e)
      );
    }

    // Configurar validación de contraseña en tiempo real
    const passwordNuevaInput = document.getElementById("passwordNueva_ahga");
    if (passwordNuevaInput) {
      passwordNuevaInput.addEventListener("focus", () => {
        this.mostrarPoliticasPassword();
      });

      passwordNuevaInput.addEventListener("input", (e) => {
        if (e.target.value.length > 0) {
          this.validarPasswordEnTiempoReal(e.target.value);
        } else {
          this.mostrarPoliticasPassword();
        }
      });
    }

    // Botón cancelar
    const botonCancelar = document.getElementById("cancelar_ahga");
    if (botonCancelar) {
      botonCancelar.addEventListener("click", () => {
        if (
          confirm(
            "¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán."
          )
        ) {
          window.history.back();
        }
      });
    }

    // Configurar eventos del componente drag-drop
    const avatarDragDrop = document.getElementById("avatarDragDrop_ahga");
    if (avatarDragDrop) {
      // Escuchar cambios en la imagen
      avatarDragDrop.addEventListener("imageChanged", (e) => {
        console.log("Nueva imagen seleccionada:", e.detail);
        this.nuevaImagenAvatar = e.detail;
      });

      // Escuchar cuando se elimina la imagen
      avatarDragDrop.addEventListener("imageRemoved", () => {
        console.log("Imagen eliminada");
        this.nuevaImagenAvatar = null;
      });
    }

    // Configurar iconos de mostrar/ocultar contraseña
    this.configurarTogglePassword(
      "passwordActual_ahga",
      "togglePasswordActual_ahga",
      "iconPasswordActual_ahga"
    );
    this.configurarTogglePassword(
      "passwordNueva_ahga",
      "togglePasswordNueva_ahga",
      "iconPasswordNueva_ahga"
    );
    this.configurarTogglePassword(
      "confirmarPassword_ahga",
      "toggleConfirmarPassword_ahga",
      "iconConfirmarPassword_ahga"
    );
  }

  // Configurar funcionalidad de mostrar/ocultar contraseña
  configurarTogglePassword(inputId, buttonId, iconId) {
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

  // Guardar cambios del perfil
  async guardarCambios(evento) {
    evento.preventDefault();

    try {
      this.mostrarNotificacion("🔄 Guardando cambios...", "info");

      const formData = new FormData(evento.target);
      const fechaNacimiento = formData.get("fechaNacimiento");
      const datosActualizados = {
        ...this.datosUsuario,
        nombre: formData.get("nombre"),
        username: formData.get("username"),
        telefono: formData.get("telefono"),
        fechaNacimiento: fechaNacimiento,
        fecha_nacimiento: fechaNacimiento, // Mantener compatibilidad con ambos nombres
      };

      // Procesar cambios en la imagen de avatar
      if (this.nuevaImagenAvatar !== undefined) {
        if (this.nuevaImagenAvatar && this.nuevaImagenAvatar.file) {
          // Nueva imagen seleccionada
          try {
            this.mostrarNotificacion("📤 Subiendo imagen...", "info");

            if (this.imageUploadService) {
              // Usar el servicio de imágenes para subir
              const userId =
                this.datosUsuario.uid || this.datosUsuario.id || "user";
              const imageResult =
                await this.imageUploadService.processProfileImage(
                  this.nuevaImagenAvatar.file,
                  userId,
                  {
                    optimize: true,
                    maxWidth: 400,
                    maxHeight: 400,
                    quality: 0.8,
                  }
                );

              // Eliminar imagen anterior si existe
              if (
                this.datosUsuario.avatar &&
                !this.datosUsuario.avatar.includes("default-avatar.svg")
              ) {
                await this.imageUploadService.deleteProfileImage(
                  this.datosUsuario.avatar
                );
              }

              datosActualizados.avatar = imageResult.url;
              datosActualizados.avatarMetadata = {
                fileName: imageResult.fileName,
                size: imageResult.processedSize,
                originalSize: imageResult.originalSize,
                type: imageResult.type,
                uploadDate: new Date().toISOString(),
              };

              console.log("✅ Imagen subida exitosamente:", imageResult);
            } else {
              // Fallback: usar preview local
              console.warn("⚠️ Usando preview local como fallback");
              datosActualizados.avatar = this.nuevaImagenAvatar.previewUrl;
            }
          } catch (imageError) {
            console.error("❌ Error al subir imagen:", imageError);
            this.mostrarNotificacion(
              `❌ Error al subir imagen: ${imageError.message}`,
              "error"
            );
            // Continuar con el guardado sin la imagen
          }
        } else if (this.nuevaImagenAvatar === null) {
          // Imagen eliminada - establecer avatar por defecto
          try {
            // Eliminar imagen anterior si existe
            if (
              this.datosUsuario.avatar &&
              !this.datosUsuario.avatar.includes("default-avatar.svg")
            ) {
              await this.imageUploadService.deleteProfileImage(
                this.datosUsuario.avatar
              );
            }

            // Establecer imagen por defecto
            datosActualizados.avatar = "../img/default-avatar.svg";
            datosActualizados.avatarMetadata = {
              fileName: "default-avatar.svg",
              size: 0,
              originalSize: 0,
              type: "image/svg+xml",
              uploadDate: new Date().toISOString(),
            };

            console.log("🗑️ Imagen eliminada, usando avatar por defecto");
          } catch (deleteError) {
            console.error("❌ Error al eliminar imagen anterior:", deleteError);
            // Continuar con el avatar por defecto aunque falle la eliminación
            datosActualizados.avatar = "../img/default-avatar.svg";
          }
        }
      }

      // Actualizar en sessionStorage
      sessionStorage.setItem(
        "datosUsuario_ahga",
        JSON.stringify(datosActualizados)
      );

      // Disparar evento para actualizar el header
      window.dispatchEvent(new CustomEvent("userDataUpdated_ahga"));

      // Actualizar en Firestore
      await this.actualizarEnFirestore(datosActualizados);

      this.mostrarNotificacion(
        "✅ Perfil actualizado correctamente",
        "success"
      );

      // Redirigir después de mostrar la notificación
      setTimeout(() => {
        window.location.href = "/dist/ver-perfil.html";
      }, 2000);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      this.mostrarNotificacion(
        "❌ Error al guardar los cambios. Inténtalo de nuevo.",
        "error"
      );
    }
  }

  // Cambiar contraseña
  async cambiarPassword(evento) {
    evento.preventDefault();

    const formData = new FormData(evento.target);
    const passwordActual = formData.get("passwordActual")?.trim();
    const passwordNueva = formData.get("passwordNueva")?.trim();
    const confirmarPassword = formData.get("confirmarPassword")?.trim();

    // Validaciones
    if (!passwordActual || !passwordNueva || !confirmarPassword) {
      this.mostrarNotificacion(
        "⚠️ Todos los campos son obligatorios",
        "warning"
      );
      return;
    }

    if (passwordNueva !== confirmarPassword) {
      this.mostrarNotificacion("⚠️ Las contraseñas no coinciden", "warning");
      return;
    }

    // Validaciones de políticas de contraseña
    const validacionPassword = validatePasswordPolicy_ahga(passwordNueva);
    if (!validacionPassword.valid) {
      this.mostrarNotificacion(`⚠️ ${validacionPassword.errors[0]}`, "warning");
      return;
    }

    if (passwordNueva.length < 8) {
      this.mostrarNotificacion(
        "⚠️ Se recomienda una contraseña de al menos 8 caracteres para mayor seguridad",
        "warning"
      );
    }

    // Verificar que la nueva contraseña sea diferente a la actual (solo si ambas tienen contenido)
    if (
      passwordActual &&
      passwordNueva &&
      passwordActual.length > 0 &&
      passwordNueva.length > 0
    ) {
      if (passwordActual === passwordNueva) {
        this.mostrarNotificacion(
          "⚠️ La nueva contraseña debe ser diferente a la actual",
          "warning"
        );
        return;
      }
    }

    try {
      // Importar el servicio de autenticación de Firebase
      const { cambiarPassword_ahga } = await import(
        "../firebase/services/auth.service.js"
      );

      // Cambiar la contraseña en Firebase Authentication
      await cambiarPassword_ahga(passwordActual, passwordNueva);

      // Verificar que el usuario sigue autenticado después del cambio
      const { verificarUsuarioActual_ahga } = await import(
        "../firebase/services/auth.service.js"
      );
      verificarUsuarioActual_ahga();

      this.mostrarNotificacion(
        "✅ Contraseña actualizada correctamente en Firebase Authentication. La nueva contraseña ya está activa.",
        "success"
      );
      console.log(
        "🔐 Contraseña actualizada exitosamente en Firebase Authentication"
      );
      console.log(
        "ℹ️ Nota: Firebase no muestra las contraseñas en la consola por seguridad"
      );
      console.log(
        "✅ Puedes verificar que funciona cerrando sesión e iniciando con la nueva contraseña"
      );

      // Limpiar formulario
      evento.target.reset();
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      // Mostrar mensaje de error más específico
      let mensajeError =
        "❌ Error al cambiar la contraseña. Inténtalo de nuevo.";
      let tipoError = "error";

      if (error.message.includes("requires-recent-login")) {
        mensajeError =
          "🔐 Por seguridad, necesitas volver a iniciar sesión antes de cambiar tu contraseña.";
        tipoError = "warning";
      }

      this.mostrarNotificacion(mensajeError, tipoError);
    }
  }

  // Actualizar en Firestore
  async actualizarEnFirestore(datos) {
    try {
      // Importar el servicio de Firestore
      const { actualizarUsuario_ahga } = await import(
        "../firebase/services/firestore.service.js"
      );

      // Verificar que tenemos el UID del usuario
      if (!datos.uid) {
        console.warn(
          "No se encontró UID del usuario, no se puede sincronizar con Firestore"
        );
        return;
      }

      // Preparar datos para Firestore (excluir campos sensibles)
      const fechaNacimiento = datos.fechaNacimiento || datos.fecha_nacimiento;
      const datosFirestore = {
        nombre: datos.nombre,
        username: datos.username,
        telefono: datos.telefono,
        fechaNacimiento: fechaNacimiento,
        fecha_nacimiento: fechaNacimiento, // Mantener compatibilidad
        fechaActualizacion: new Date().toISOString(),
      };

      // Incluir avatar y metadatos si están presentes
      if (datos.avatar) {
        datosFirestore.avatar = datos.avatar;
      }
      if (datos.avatarMetadata) {
        datosFirestore.avatarMetadata = datos.avatarMetadata;
      }

      // Actualizar en Firestore
      await actualizarUsuario_ahga(datos.uid, datosFirestore);
      console.log(
        "Datos sincronizados correctamente con Firestore:",
        datosFirestore
      );
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      // No lanzamos el error para que no interrumpa el flujo del usuario
      // El usuario verá que se guardó localmente aunque falle la sincronización
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new EditarPerfil_AHGA();
});
