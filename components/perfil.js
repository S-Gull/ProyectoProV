class ProfileManager_AHGA extends HTMLElement {
  constructor() {
    super();
    this.createProfileModals();
  }

  // Crear modales dinámicamente en lugar de cargar archivo HTML
  createProfileModals() {
    try {
      const modalsHTML = this.getModalsHTML();
      document.body.insertAdjacentHTML("beforeend", modalsHTML);
      this.setupEventListeners();
    } catch (error) {
      console.error("Error al crear modales de perfil:", error);
    }
  }

  // Generar HTML de los modales
  getModalsHTML() {
    return `
      <!-- Modal de Perfil -->
      <div id="modalPerfil_ahga" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] hidden">
        <div class="bg-[#25262b] border border-[#454955] rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-6 border-b border-[#454955]">
            <h2 class="text-xl font-semibold text-[#f3eff5]">Mi Perfil</h2>
            <button id="cerrarModalPerfil_ahga" class="text-[#f3eff5] hover:text-[#72b01d] transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div id="contenidoPerfil_ahga" class="p-6">
            <!-- Contenido dinámico del perfil -->
          </div>
        </div>
      </div>

      <!-- Modal de Editar Perfil -->
      <div id="modalEditarPerfil_ahga" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] hidden">
        <div class="bg-[#25262b] border border-[#454955] rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-6 border-b border-[#454955]">
            <h2 class="text-xl font-semibold text-[#f3eff5]">Editar Perfil</h2>
            <button id="cerrarModalEditarPerfil_ahga" class="text-[#f3eff5] hover:text-[#72b01d] transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6">
            <form id="formularioEditarPerfil_ahga">
              <!-- Contenido dinámico del formulario -->
            </form>
          </div>
        </div>
      </div>

      <!-- Modal de Cambiar Contraseña -->
      <div id="modalCambiarContrasena_ahga" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] hidden">
        <div class="bg-[#25262b] border border-[#454955] rounded-lg w-full max-w-md mx-4">
          <div class="flex justify-between items-center p-6 border-b border-[#454955]">
            <h2 class="text-xl font-semibold text-[#f3eff5]">Cambiar Contraseña</h2>
            <button id="cerrarModalCambiarContrasena_ahga" class="text-[#f3eff5] hover:text-[#72b01d] transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6">
            <form id="formularioCambiarContrasena_ahga" class="space-y-4">
              <div>
                <label class="block text-[#72b01d] text-sm font-medium">Contraseña Actual:</label>
                <input type="password" id="contrasenaActual_ahga" required 
                       class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
              </div>
              <div>
                <label class="block text-[#72b01d] text-sm font-medium mb-2">Nueva Contraseña:</label>
                <input type="password" id="nuevaContrasena_ahga" required minlength="6"
                       class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
              </div>
              <div>
                <label class="block text-[#72b01d] text-sm font-medium mb-2">Confirmar Nueva Contraseña:</label>
                <input type="password" id="confirmarNuevaContrasena_ahga" required minlength="6"
                       class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
              </div>
              <div class="flex space-x-3 mt-6">
                <button type="button" id="cancelarCambioContrasena_ahga" class="flex-1 bg-[#454955] hover:bg-[#5a5b66] text-[#f3eff5] py-2 px-4 rounded-lg transition-colors duration-200">
                  Cancelar
                </button>
                <button type="submit" class="flex-1 bg-[#72b01d] hover:bg-[#3f7d20] text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  Cambiar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Cerrar modales
    document
      .getElementById("cerrarModalPerfil_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalPerfil_ahga");
      });

    document
      .getElementById("cerrarModalEditarPerfil_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalEditarPerfil_ahga");
      });

    document
      .getElementById("cerrarModalCambiarContrasena_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalCambiarContrasena_ahga");
      });

    // Formulario de cambiar contraseña
    document
      .getElementById("formularioCambiarContrasena_ahga")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        this.cambiarContrasena();
      });

    document
      .getElementById("cancelarCambioContrasena_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalCambiarContrasena_ahga");
      });

    // Cerrar modales al hacer click fuera
    [
      "modalPerfil_ahga",
      "modalEditarPerfil_ahga",
      "modalCambiarContrasena_ahga",
    ].forEach((modalId) => {
      document.getElementById(modalId)?.addEventListener("click", (e) => {
        if (e.target.id === modalId) {
          this.hideModal(modalId);
        }
      });
    });
  }

  // Obtener datos del usuario desde sessionStorage
  obtenerDatosUsuario() {
    try {
      const datosUsuario = sessionStorage.getItem("datosUsuario_ahga");
      return datosUsuario ? JSON.parse(datosUsuario) : null;
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  }

  // Mostrar modal de perfil
  mostrarModalPerfil() {
    const datosUsuario = this.obtenerDatosUsuario();
    if (!datosUsuario) return;

    const contenidoPerfil = document.getElementById("contenidoPerfil_ahga");
    const avatar = datosUsuario.avatar || "../img/default-avatar.svg";

    contenidoPerfil.innerHTML = `
      <div class="text-center mb-6">
        <img src="${avatar}" alt="Avatar" class="w-20 h-20 rounded-full mx-auto mb-4 object-cover">
        <h3 class="text-lg font-semibold text-[#f3eff5]">${
          datosUsuario.nombre || "Sin nombre"
        } ${datosUsuario.apellido || ""}</h3>
        <p class="text-[#72b01d] text-sm">@${
          datosUsuario.nombreUsuario || "usuario"
        }</p>
      </div>
      
      <div class="space-y-3">
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Email:</label>
          <p class="text-[#f3eff5]">${datosUsuario.email}</p>
        </div>
        
        ${
          datosUsuario.fecha_nacimiento
            ? `
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Fecha de Nacimiento:</label>
          <p class="text-[#f3eff5]">${datosUsuario.fecha_nacimiento}</p>
        </div>
        `
            : ""
        }
        
        ${
          datosUsuario.telefono
            ? `
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Teléfono:</label>
          <p class="text-[#f3eff5]">${datosUsuario.telefono}</p>
        </div>
        `
            : ""
        }
        
        ${
          datosUsuario.codigoPostal
            ? `
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Código Postal:</label>
          <p class="text-[#f3eff5]">${datosUsuario.codigoPostal}</p>
        </div>
        `
            : ""
        }
        
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Rol:</label>
          <p class="text-[#f3eff5] capitalize">${
            datosUsuario.rol || "Usuario"
          }</p>
        </div>
        
        <div class="bg-[#1a1b1f] p-3 rounded-lg">
          <label class="text-[#72b01d] text-sm font-medium">Miembro desde:</label>
          <p class="text-[#f3eff5]">${
            datosUsuario.fechaRegistro || "No disponible"
          }</p>
        </div>
      </div>
      
      <div class="mt-6 flex space-x-3">
        <button id="editarDesdePerfil_ahga" class="flex-1 bg-[#72b01d] hover:bg-[#3f7d20] text-white py-2 px-4 rounded-lg transition-colors duration-200">
          Editar Perfil
        </button>
        <button id="cambiarContrasena_ahga" class="flex-1 bg-[#454955] hover:bg-[#5a5b66] text-[#f3eff5] py-2 px-4 rounded-lg transition-colors duration-200">
          Cambiar Contraseña
        </button>
      </div>
    `;

    // Eventos para botones del modal
    document
      .getElementById("editarDesdePerfil_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalPerfil_ahga");
        this.mostrarModalEditarPerfil();
      });

    document
      .getElementById("cambiarContrasena_ahga")
      ?.addEventListener("click", () => {
        this.mostrarModalCambiarContrasena();
      });

    this.showModal("modalPerfil_ahga");
  }

  // Mostrar modal de editar perfil
  mostrarModalEditarPerfil() {
    const datosUsuario = this.obtenerDatosUsuario();
    if (!datosUsuario) return;

    const formularioEditar = document.getElementById(
      "formularioEditarPerfil_ahga"
    );

    formularioEditar.innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[#72b01d] text-sm font-medium mb-2">Nombre:</label>
            <input type="text" id="editarNombre_ahga" value="${
              datosUsuario.nombre || ""
            }" 
                   class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
          </div>
          <div>
            <label class="block text-[#72b01d] text-sm font-medium mb-2">Apellido:</label>
            <input type="text" id="editarApellido_ahga" value="${
              datosUsuario.apellido || ""
            }" 
                   class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
          </div>
        </div>
        
        <div>
          <label class="block text-[#72b01d] text-sm font-medium mb-2">Nombre de Usuario:</label>
          <input type="text" id="editarNombreUsuario_ahga" value="${
            datosUsuario.nombreUsuario || ""
          }" 
                 class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
        </div>
        
        <div>
          <label class="block text-[#72b01d] text-sm font-medium mb-2">Email:</label>
          <input type="email" id="editarEmail_ahga" value="${
            datosUsuario.email || ""
          }" 
                 class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
        </div>
        
        <div>
          <label class="block text-[#72b01d] text-sm font-medium mb-2">Fecha de Nacimiento:</label>
          <input type="date" id="editarFechaNacimiento_ahga" value="${
            datosUsuario.fecha_nacimiento || ""
          }" 
                 class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
        </div>
        
        <div>
          <label class="block text-[#72b01d] text-sm font-medium mb-2">Teléfono:</label>
          <input type="tel" id="editarTelefono_ahga" value="${
            datosUsuario.telefono || ""
          }" 
                 class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
        </div>
        
        <div>
          <label class="block text-[#72b01d] text-sm font-medium mb-2">Código Postal:</label>
          <input type="text" id="editarCodigoPostal_ahga" value="${
            datosUsuario.codigoPostal || ""
          }" 
                 class="w-full bg-[#1a1b1f] border border-[#454955] text-[#f3eff5] px-3 py-2 rounded-lg focus:border-[#72b01d] focus:outline-none">
        </div>
      </div>
      
      <div class="mt-6 flex space-x-3">
        <button type="button" id="cancelarEdicion_ahga" class="flex-1 bg-[#454955] hover:bg-[#5a5b66] text-[#f3eff5] py-2 px-4 rounded-lg transition-colors duration-200">
          Cancelar
        </button>
        <button type="submit" class="flex-1 bg-[#72b01d] hover:bg-[#3f7d20] text-white py-2 px-4 rounded-lg transition-colors duration-200">
          Guardar Cambios
        </button>
      </div>
    `;

    // Eventos del formulario
    document
      .getElementById("cancelarEdicion_ahga")
      ?.addEventListener("click", () => {
        this.hideModal("modalEditarPerfil_ahga");
      });

    formularioEditar.addEventListener("submit", (e) => {
      e.preventDefault();
      this.guardarCambiosPerfil();
    });

    this.showModal("modalEditarPerfil_ahga");
  }

  // Mostrar modal de cambiar contraseña
  mostrarModalCambiarContrasena() {
    this.showModal("modalCambiarContrasena_ahga");
  }

  // Guardar cambios del perfil
  guardarCambiosPerfil() {
    const datosUsuario = this.obtenerDatosUsuario();
    if (!datosUsuario) return;

    const datosActualizados = {
      ...datosUsuario,
      nombre: document.getElementById("editarNombre_ahga").value,
      apellido: document.getElementById("editarApellido_ahga").value,
      nombreUsuario: document.getElementById("editarNombreUsuario_ahga").value,
      email: document.getElementById("editarEmail_ahga").value,
      fechaNacimiento: document.getElementById("editarFechaNacimiento_ahga")
        .value,
      telefono: document.getElementById("editarTelefono_ahga").value,
      codigoPostal: document.getElementById("editarCodigoPostal_ahga").value,
    };

    sessionStorage.setItem(
      "datosUsuario_ahga",
      JSON.stringify(datosActualizados)
    );

    // Disparar evento para actualizar el header
    window.dispatchEvent(new CustomEvent("userDataUpdated_ahga"));
    this.actualizarUsuarioEnFirebase(datosActualizados);
    this.hideModal("modalEditarPerfil_ahga");
    this.mostrarMensajeExito("Perfil actualizado correctamente");

    setTimeout(() => {
      location.reload();
    }, 1500);
  }

  // Cambiar contraseña
  async cambiarContrasena() {
    const contrasenaActual = document.getElementById(
      "contrasenaActual_ahga"
    ).value;
    const nuevaContrasena = document.getElementById(
      "nuevaContrasena_ahga"
    ).value;
    const confirmarNuevaContrasena = document.getElementById(
      "confirmarNuevaContrasena_ahga"
    ).value;

    if (nuevaContrasena !== confirmarNuevaContrasena) {
      alert("Las nuevas contraseñas no coinciden");
      return;
    }

    if (nuevaContrasena.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Aquí implementarías la lógica para cambiar contraseña en Firebase
      const { cambiarContrasena_ahga } = await import(
        "../firebase/services/auth.service.js"
      );
      await cambiarContrasena_ahga(contrasenaActual, nuevaContrasena);

      this.hideModal("modalCambiarContrasena_ahga");
      this.mostrarMensajeExito("Contraseña cambiada correctamente");

      // Limpiar formulario
      document.getElementById("formularioCambiarContrasena_ahga").reset();
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      alert("Error al cambiar la contraseña: " + error.message);
    }
  }

  // Actualizar usuario en Firebase
  async actualizarUsuarioEnFirebase(datosActualizados) {
    try {
      const { actualizarUsuario_ahga } = await import(
        "../firebase/services/firestore.service.js"
      );
      await actualizarUsuario_ahga(datosActualizados.uid, datosActualizados);
    } catch (error) {
      console.error("Error al actualizar usuario en Firebase:", error);
    }
  }

  // Mostrar mensaje de éxito
  mostrarMensajeExito(mensaje) {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-[#72b01d] text-white px-6 py-3 rounded-lg shadow-lg z-[70] transition-opacity duration-300";
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 2000);
  }

  // Utilidades para modales
  showModal(modalId) {
    document.getElementById(modalId)?.classList.remove("hidden");
  }

  hideModal(modalId) {
    document.getElementById(modalId)?.classList.add("hidden");
  }
}

customElements.define("profile-manager-ahga", ProfileManager_AHGA);
export default ProfileManager_AHGA;
