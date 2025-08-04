// Ver Perfil - Funcionalidad
import { obtenerCuponesUsuario_ahga } from "../firebase/services/firestore.service.js";
import { verificarUsuarioActual_ahga } from "../firebase/services/auth.service.js";

class VerPerfil_AHGA {
  constructor() {
    this.datosUsuario = null;
    this.init();
  }

  async init() {
    await this.cargarDatosUsuario();
    this.mostrarDatosPerfil();
    await this.cargarCupones();
    this.configurarEventos();
  }

  // Cargar datos del usuario
  async cargarDatosUsuario() {
    try {
      console.log("🔍 [DEBUG] Iniciando carga de datos del usuario...");

      // Intentar obtener datos del sessionStorage
      const datosSession = sessionStorage.getItem("datosUsuario_ahga");
      console.log("🔍 [DEBUG] Datos en sessionStorage:", datosSession);

      if (datosSession) {
        this.datosUsuario = JSON.parse(datosSession);
        console.log(
          "🔍 [DEBUG] Datos del usuario parseados:",
          this.datosUsuario
        );
        console.log(
          "🔍 [DEBUG] Tipo de datos del usuario:",
          typeof this.datosUsuario
        );
        console.log(
          "🔍 [DEBUG] Propiedades del usuario:",
          Object.keys(this.datosUsuario)
        );
        return;
      }

      // Si no hay datos en session, redirigir al login
      console.log(
        "⚠️ [DEBUG] No hay datos en sessionStorage, redirigiendo al login"
      );
      alert("Debes iniciar sesión para ver tu perfil");
      window.location.href = "/dist/login.html";
    } catch (error) {
      console.error("❌ [DEBUG] Error al cargar datos del usuario:", error);
      alert("Error al cargar los datos del usuario");
    }
  }

  // Mostrar datos del perfil en la interfaz
  mostrarDatosPerfil() {
    console.log("🎨 [DEBUG] Iniciando mostrarDatosPerfil...");

    if (!this.datosUsuario) {
      console.log("⚠️ [DEBUG] No hay datos de usuario disponibles");
      return;
    }

    console.log("🎨 [DEBUG] Datos del usuario a mostrar:", this.datosUsuario);

    const elementos = {
      avatarPerfil: document.getElementById("avatarPerfil_ahga"),
      nombrePerfil: document.getElementById("nombrePerfil_ahga"),
      emailPerfil: document.getElementById("emailPerfil_ahga"),
      nombreCompleto: document.getElementById("nombreCompleto_ahga"),
      telefonoPerfil: document.getElementById("telefonoPerfil_ahga"),
      fechaNacimientoPerfil: document.getElementById(
        "fechaNacimientoPerfil_ahga"
      ),
      fechaRegistro: document.getElementById("fechaRegistro_ahga"),
      partidasGanadas: document.getElementById("partidasGanadas_ahga"),
    };

    console.log("🎨 [DEBUG] Elementos DOM encontrados:", elementos);

    // Información básica
    const usernameMostrar =
      this.datosUsuario.username ||
      this.datosUsuario.nombreUsuario ||
      this.datosUsuario.email.split("@")[0];

    console.log("📝 [DEBUG] Username a mostrar:", usernameMostrar);
    console.log("📝 [DEBUG] Email del usuario:", this.datosUsuario.email);

    if (elementos.nombrePerfil) {
      elementos.nombrePerfil.textContent = usernameMostrar;
      console.log("📝 [DEBUG] Username asignado al elemento nombrePerfil");
    } else {
      console.log("⚠️ [DEBUG] Elemento nombrePerfil no encontrado");
    }

    if (elementos.emailPerfil) {
      elementos.emailPerfil.textContent = this.datosUsuario.email;
      console.log("📝 [DEBUG] Email asignado al elemento emailPerfil");
    } else {
      console.log("⚠️ [DEBUG] Elemento emailPerfil no encontrado");
    }

    if (elementos.nombreCompleto) {
      const nombreCompleto = this.datosUsuario.nombre || "No especificado";
      elementos.nombreCompleto.textContent = nombreCompleto;
      console.log("📝 [DEBUG] Nombre completo asignado:", nombreCompleto);
    } else {
      console.log("⚠️ [DEBUG] Elemento nombreCompleto no encontrado");
    }

    if (elementos.telefonoPerfil) {
      // Manejar diferentes tipos de datos para teléfono
      console.log(
        "📞 [DEBUG] Datos de teléfono originales:",
        this.datosUsuario.telefono
      );
      console.log(
        "📞 [DEBUG] Tipo de teléfono:",
        typeof this.datosUsuario.telefono
      );

      let telefonoTexto = "No especificado";
      if (this.datosUsuario.telefono) {
        if (typeof this.datosUsuario.telefono === "string") {
          telefonoTexto = this.datosUsuario.telefono;
          console.log("📞 [DEBUG] Teléfono como string:", telefonoTexto);
        } else if (typeof this.datosUsuario.telefono === "object") {
          // Si es un objeto, intentar extraer el valor
          telefonoTexto =
            this.datosUsuario.telefono.numero ||
            this.datosUsuario.telefono.value ||
            this.datosUsuario.telefono.toString();
          console.log("📞 [DEBUG] Teléfono extraído de objeto:", telefonoTexto);
        }
      }
      elementos.telefonoPerfil.textContent = telefonoTexto;
      console.log("📞 [DEBUG] Teléfono final asignado:", telefonoTexto);
    } else {
      console.log("⚠️ [DEBUG] Elemento telefonoPerfil no encontrado");
    }

    if (elementos.fechaNacimientoPerfil) {
      // La fecha de nacimiento siempre es un string
      console.log(
        "📅 [DEBUG] Datos de fecha de nacimiento originales:",
        this.datosUsuario.fecha_nacimiento
      );
      console.log(
        "📅 [DEBUG] Tipo de fecha de nacimiento:",
        typeof this.datosUsuario.fecha_nacimiento
      );

      let fechaTexto = "No especificado";
      if (this.datosUsuario.fecha_nacimiento) {
        fechaTexto = this.formatearFecha(this.datosUsuario.fecha_nacimiento);
        console.log("📅 [DEBUG] Fecha formateada:", fechaTexto);
      }
      elementos.fechaNacimientoPerfil.textContent = fechaTexto;
      console.log("📅 [DEBUG] Fecha de nacimiento final asignada:", fechaTexto);
    } else {
      console.log("⚠️ [DEBUG] Elemento fechaNacimientoPerfil no encontrado");
    }

    // Avatar
    if (elementos.avatarPerfil) {
      const avatarUrl = this.datosUsuario.avatar || "../img/default-avatar.svg";
      elementos.avatarPerfil.src = avatarUrl;
      console.log("🖼️ [DEBUG] Avatar URL asignada:", avatarUrl);
    } else {
      console.log("⚠️ [DEBUG] Elemento avatarPerfil no encontrado");
    }

    // Fechas
    if (elementos.fechaRegistro) {
      const fechaRegistro =
        this.datosUsuario.fechaRegistro || new Date().toISOString();
      const fechaFormateada = this.formatearFecha(fechaRegistro);
      elementos.fechaRegistro.textContent = `Miembro desde: ${fechaFormateada}`;
      console.log(
        "📅 [DEBUG] Fecha de registro original:",
        this.datosUsuario.fechaRegistro
      );
      console.log("📅 [DEBUG] Fecha de registro formateada:", fechaFormateada);
    } else {
      console.log("⚠️ [DEBUG] Elemento fechaRegistro no encontrado");
    }

    // Estadísticas
    if (elementos.partidasGanadas) {
      const partidasGanadas =
        this.datosUsuario.estadisticas?.partidasGanadas || "0";
      elementos.partidasGanadas.textContent = partidasGanadas;
      console.log(
        "🏆 [DEBUG] Estadísticas del usuario:",
        this.datosUsuario.estadisticas
      );
      console.log("🏆 [DEBUG] Partidas ganadas asignadas:", partidasGanadas);
    } else {
      console.log("⚠️ [DEBUG] Elemento partidasGanadas no encontrado");
    }

    console.log("✅ [DEBUG] Finalizado mostrarDatosPerfil");
  }

  // Cargar cupones del usuario
  async cargarCupones() {
    try {
      console.log("🎫 [DEBUG] Iniciando carga de cupones...");

      // Primero intentar obtener el usuario de Firebase Auth
      let usuario = verificarUsuarioActual_ahga();

      // Si no hay usuario en Firebase Auth, intentar obtener de sessionStorage
      if (!usuario && this.datosUsuario) {
        console.log(
          "🎫 [DEBUG] Usando datos de sessionStorage para obtener UID"
        );
        // Buscar el UID en los datos del usuario
        const uid = this.datosUsuario.uid || this.datosUsuario.id;
        if (uid) {
          usuario = { uid: uid };
          console.log("🎫 [DEBUG] UID encontrado en sessionStorage:", uid);
        }
      }

      if (!usuario || !usuario.uid) {
        console.log("⚠️ [DEBUG] No se pudo obtener UID del usuario");
        this.mostrarMensajeCupones(
          "No se pudo cargar la información del usuario"
        );
        return;
      }

      console.log("🎫 [DEBUG] Obteniendo cupones para UID:", usuario.uid);
      const cupones = await obtenerCuponesUsuario_ahga(usuario.uid);
      console.log("🎫 [DEBUG] Cupones obtenidos:", cupones);

      this.mostrarCupones(cupones);
    } catch (error) {
      console.error("❌ [DEBUG] Error al cargar cupones:", error);
      this.mostrarMensajeCupones("Error al cargar cupones");
    }
  }

  // Mostrar cupones en la interfaz
  mostrarCupones(cupones) {
    const contenedorCupones = document.getElementById(
      "cuponesDisponibles_ahga"
    );

    if (!contenedorCupones) {
      console.log("⚠️ [DEBUG] Contenedor de cupones no encontrado");
      return;
    }

    if (!cupones || cupones.length === 0) {
      this.mostrarMensajeCupones("No tienes cupones disponibles");
      return;
    }

    // Filtrar solo cupones activos y no usados
    const cuponesDisponibles = cupones.filter(
      (cupon) =>
        cupon.activo &&
        !cupon.usado &&
        new Date(cupon.fechaVencimiento) > new Date()
    );

    if (cuponesDisponibles.length === 0) {
      this.mostrarMensajeCupones("No tienes cupones disponibles");
      return;
    }

    // Crear HTML para cada cupón
    const cuponesHTML = cuponesDisponibles
      .map((cupon) => {
        const fechaVencimiento = new Date(
          cupon.fechaVencimiento
        ).toLocaleDateString("es-ES");
        const descuentoPorcentaje = Math.round(cupon.descuento * 100);

        return `
        <div class="bg-[#1a1b23] border border-[#72b01d] rounded-lg p-4 hover:bg-[#25262b] transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-percentage text-[#72b01d]"></i>
                <span class="font-bold text-[#f3eff5]">${descuentoPorcentaje}% de descuento</span>
              </div>
              <div class="text-sm text-[#b8b3ba] mb-2">
                <i class="fas fa-calendar-alt mr-1"></i>
                Válido hasta: ${fechaVencimiento}
              </div>
              <div class="flex items-center space-x-2">
                <code class="bg-[#2a2d3a] text-[#72b01d] px-2 py-1 rounded text-sm font-mono">${cupon.codigo}</code>
                <button 
                  onclick="navigator.clipboard.writeText('${cupon.codigo}').then(() => {
                    this.textContent = '¡Copiado!';
                    setTimeout(() => this.textContent = 'Copiar', 2000);
                  })"
                  class="bg-[#72b01d] hover:bg-[#5a8c16] text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    contenedorCupones.innerHTML = cuponesHTML;
    console.log("🎫 [DEBUG] Cupones mostrados en la interfaz");
  }

  // Mostrar mensaje cuando no hay cupones o hay error
  mostrarMensajeCupones(mensaje) {
    const contenedorCupones = document.getElementById(
      "cuponesDisponibles_ahga"
    );
    if (contenedorCupones) {
      contenedorCupones.innerHTML = `
        <div class="text-sm text-[#b8b3ba] italic text-center py-4">
          <i class="fas fa-info-circle mr-2"></i>
          ${mensaje}
        </div>
      `;
    }
  }

  // Configurar eventos de los botones
  configurarEventos() {
    // Botón Editar Perfil
    const editarPerfilBtn = document.getElementById("editarPerfilBtn_ahga");
    if (editarPerfilBtn) {
      editarPerfilBtn.addEventListener("click", () => {
        window.location.href = "/dist/editar-perfil.html";
      });
    }

    // Botón Volver
    const volverBtn = document.getElementById("volverBtn_ahga");
    if (volverBtn) {
      volverBtn.addEventListener("click", () => {
        window.history.back();
      });
    }
  }

  // Formatear fecha
  formatearFecha(fechaString) {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Fecha no válida";
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new VerPerfil_AHGA();
});

// Exportar para uso en otros módulos si es necesario
export default VerPerfil_AHGA;
