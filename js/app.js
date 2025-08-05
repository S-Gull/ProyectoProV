// app.js
import { ControladorJuego_ahga } from "./administradorJuego.js";
import { auth_ahga } from "../firebase/services/index.js";
import {
  iniciarSesion_ahga,
  registrarUsuario_ahga,
  cerrarSesion_ahga,
} from "../firebase/services/auth.service.js";
import {
  guardarPartida_ahga,
  obtenerEstadisticasJugador_ahga,
} from "../firebase/services/partidas.service.js";
import {
  obtenerUsuario_ahga,
  validarCredencialesFirestore_ahga,
} from "../firebase/services/firestore.service.js";
import { ModalDialog_ahga, modal_ahga } from "./modal.js";

class UIHandler_ahga {
  constructor() {
    this.contadorSoldados_ahga = document.getElementById(
      "contadorSoldados_ahga"
    );
    this.contadorOficiales_ahga = document.getElementById(
      "contadorOficiales_ahga"
    );
  }

  actualizarEstadisticas_ahga(cantSoldados, cantOficiales) {
    if (this.contadorSoldados_ahga) {
      this.contadorSoldados_ahga.textContent = cantSoldados;
    }
    if (this.contadorOficiales_ahga) {
      this.contadorOficiales_ahga.textContent = cantOficiales;
    }
  }

  mostrarReglas_ahga() {
    // Crear modal con estilos negro y verde como la página
    const modalOverlay = document.createElement("div");
    modalOverlay.className =
      "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4";
    modalOverlay.style.cssText = `
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 50, 0, 0.1));
      backdrop-filter: blur(10px);
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
      border: 3px solid #00ff00;
      border-radius: 20px;
      padding: 2rem;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3);
      color: #ffffff;
      transition: all 0.3s ease;
    `;

    modalContent.innerHTML = `
      <div style="text-align: left; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 2rem;">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style="display: inline-block; margin-right: 10px; vertical-align: middle;">
             <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#00ff00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
           </svg>
           <h3 style="display: inline-block; font-size: 2rem; font-weight: bold; color: #00ff00; margin: 0; vertical-align: middle;">REGLAS DEL JUEGO ASALTO</h3>
         </div>
        
        <div style="background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 0, 0, 0.3)); border: 2px solid rgba(0, 255, 0, 0.5); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);">
           <h4 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; display: flex; align-items: center;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#00ff00"/>
             </svg>
             1. OBJETIVOS:
           </h4>
           <ul style="margin-left: 2rem; list-style: none; padding: 0;">
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               <span style="font-weight: bold; color: #00ff00;">Atacantes (Soldados):</span> Ocupar la fortaleza o capturar ambos oficiales
             </li>
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               <span style="font-weight: bold; color: #00ff00;">Defensores (Oficiales):</span> Eliminar suficientes soldados (menos de 9)
             </li>
           </ul>
         </div>
        
        <div style="background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 0, 0, 0.3)); border: 2px solid rgba(0, 255, 0, 0.5); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);">
           <h4 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; display: flex; align-items: center;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
               <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#00ff00"/>
             </svg>
             2. MOVIMIENTOS:
           </h4>
           <ul style="margin-left: 2rem; list-style: none; padding: 0;">
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               <span style="font-weight: bold; color: #00ff00;">Soldados:</span> Avanzan hacia arriba o lateralmente
             </li>
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               <span style="font-weight: bold; color: #00ff00;">Oficiales:</span> Se mueven en cualquier dirección y capturan saltando
             </li>
           </ul>
         </div>
        
        <div style="background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 0, 0, 0.3)); border: 2px solid rgba(0, 255, 0, 0.5); border-radius: 15px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.2);">
           <h4 style="font-size: 1.3rem; font-weight: bold; margin-bottom: 1rem; color: #00ff00; display: flex; align-items: center;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
               <circle cx="12" cy="12" r="10" stroke="#00ff00" stroke-width="2"/>
               <polyline points="12,6 12,12 16,14" stroke="#00ff00" stroke-width="2" stroke-linecap="round"/>
             </svg>
             3. TURNOS:
           </h4>
           <ul style="margin-left: 2rem; list-style: none; padding: 0;">
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               Alternados entre atacantes y defensores
             </li>
             <li style="margin-bottom: 0.8rem; color: #ffffff; position: relative; padding-left: 1.5rem;">
               <span style="position: absolute; left: 0; color: #00ff00; font-weight: bold;">•</span>
               Selecciona tu pieza y luego la casilla destino
             </li>
           </ul>
         </div>
        
        <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, rgba(0, 255, 0, 0.15), rgba(0, 0, 0, 0.3)); border-radius: 15px; border: 2px solid rgba(0, 255, 0, 0.6);">
           <p style="color: #00ff00; font-style: italic; font-size: 1.2rem; margin: 0; font-weight: bold;">
             ¡Que comience la batalla estratégica! ⚔️
           </p>
         </div>
        
        <div style="display: flex; justify-content: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid rgba(0, 255, 0, 0.5);">
           <button id="btnCerrar" 
                   style="background: linear-gradient(135deg, #00ff00 0%, #00cc00 50%, #00ff00 100%); color: #000000; font-weight: bold; padding: 12px 24px; border: none; border-radius: 25px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0, 255, 0, 0.4); font-size: 1rem;"
                   onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 8px 25px rgba(0, 255, 0, 0.6)'; this.style.background='linear-gradient(135deg, #00cc00 0%, #00ff00 50%, #00cc00 100%)';" 
                   onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 5px 15px rgba(0, 255, 0, 0.4)'; this.style.background='linear-gradient(135deg, #00ff00 0%, #00cc00 50%, #00ff00 100%)';"
                   onmousedown="this.style.transform='scale(0.95)';" 
                   onmouseup="this.style.transform='scale(1.05)';">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="display: inline-block; margin-right: 8px; vertical-align: middle;">
               <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
             Cerrar
           </button>
         </div>
      </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Eventos para cerrar el modal
    const btnCerrar = modalContent.querySelector("#btnCerrar");

    btnCerrar.addEventListener("click", () => {
      document.body.removeChild(modalOverlay);
    });

    // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });

    // Cerrar con tecla Escape
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        document.body.removeChild(modalOverlay);
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }
}

class App_ahga {
  constructor() {
    // === Referencias DOM principales ===
    this.canvas_ahga = document.getElementById("canvasJuego_ah_ga");
    this.btnAyuda_ahga = document.getElementById("botonAyuda_ah_ga");
    // this.btnReiniciar_ahga = document.getElementById("botonReiniciar_ahga"); // No existe en HTML
    // this.pantallaLogin = document.getElementById("pantallaLogin"); // No existe en HTML
    // this.pantallaJuego = document.getElementById("pantallaJuego"); // No existe en HTML
    // this.btnSalir = document.getElementById("botonSalir"); // No existe en HTML

    this.ui_ahga = new UIHandler_ahga();
    this.juego_ahga = null;
    this.usuarioActual = null;
    this.jugador2 = null;
    this.equipoJugador1 = null;
    this.equipoJugador2 = null;
    this.modoJuego = null; // 'invitado' o 'registrado'
    this.tiempoInicioPartida_ahga = null;
    this.modal = new ModalDialog_ahga();

    // Escuchar cambios de autenticación
    auth_ahga.onAuthStateChanged(async (usuario_ahga) => {
      if (usuario_ahga) {
        console.log("✅ Usuario autenticado:", usuario_ahga.email);

        // Obtener datos adicionales del usuario desde Firestore
        try {
          const { obtenerUsuario_ahga } = await import(
            "../firebase/services/firestore.service.js"
          );
          const datosUsuario_ahga = await obtenerUsuario_ahga(usuario_ahga.uid);
          
          // Obtener estadísticas del usuario
          let estadisticasUsuario_ahga = null;
          try {
            estadisticasUsuario_ahga = await obtenerEstadisticasJugador_ahga(usuario_ahga.uid);
            console.log("📊 Estadísticas obtenidas en login:", estadisticasUsuario_ahga);
          } catch (errorEstadisticas) {
            console.log("⚠️ No se pudieron obtener estadísticas (usuario nuevo):", errorEstadisticas.message);
            estadisticasUsuario_ahga = {
              partidasJugadas: 0,
              partidasGanadas: 0,
              partidasPerdidas: 0,
              victoriasComoAtacante: 0,
              victoriasComoDefensor: 0,
              derrotasComoAtacante: 0,
              derrotasComoDefensor: 0
            };
          }

          // Combinar datos de Firebase Auth con Firestore y estadísticas
          const datosCompletosUsuario_ahga = {
            uid: usuario_ahga.uid,
            email: usuario_ahga.email,
            emailVerificado: usuario_ahga.emailVerified,
            ...datosUsuario_ahga,
            estadisticas: estadisticasUsuario_ahga,
            fechaRegistro:
              datosUsuario_ahga?.fechaRegistro ||
              new Date().toLocaleDateString("es-ES"),
          };

          // Guardar en sessionStorage y asignar a usuarioActual
          sessionStorage.setItem(
            "datosUsuario_ahga",
            JSON.stringify(datosCompletosUsuario_ahga)
          );

          this.usuarioActual = datosCompletosUsuario_ahga;

          console.log(
            "Datos del usuario guardados en sessionStorage:",
            datosCompletosUsuario_ahga
          );
        } catch (error_ahga) {
          console.error("Error al obtener datos del usuario:", error_ahga);
          // Guardar datos básicos si hay error
          const datosBasicosUsuario_ahga = {
            uid: usuario_ahga.uid,
            email: usuario_ahga.email,
            emailVerificado: usuario_ahga.emailVerified,
            fechaRegistro: new Date().toLocaleDateString("es-ES"),
            estadisticas: {
              partidasJugadas: 0,
              partidasGanadas: 0,
              partidasPerdidas: 0,
              victoriasComoAtacante: 0,
              victoriasComoDefensor: 0,
              derrotasComoAtacante: 0,
              derrotasComoDefensor: 0
            }
          };
          sessionStorage.setItem(
            "datosUsuario_ahga",
            JSON.stringify(datosBasicosUsuario_ahga)
          );

          this.usuarioActual = datosBasicosUsuario_ahga;
        }

        this.mostrarPantallaJuego();
        // No iniciar el juego automáticamente, esperar a que el usuario haga clic en "Nueva Partida"
      } else {
        console.log("⚠️ No hay usuario logueado, mostrar pantalla login");

        // Limpiar sessionStorage y usuarioActual
        sessionStorage.removeItem("datosUsuario_ahga");
        sessionStorage.removeItem("tokenAuth_ahga");
        this.usuarioActual = null;

        this.mostrarPantallaLogin();
        this.destruirJuego_ahga();
      }
    });

    this.conectarEventos_ahga();
  }

  conectarEventos_ahga() {
    // Botón Nueva Partida
    const btnNuevaPartida = document.getElementById("nuevoJuegoBtn_ah_ga");
    btnNuevaPartida?.addEventListener("click", async () => {
      await this.iniciarJuego_ahga();
    });

    // Botón ayuda
    this.btnAyuda_ahga?.addEventListener("click", () => {
      this.ui_ahga.mostrarReglas_ahga();
      console.log("reglas");
    });

    // Botón reiniciar
    // this.btnReiniciar_ahga?.addEventListener("click", () => {
    //   this.juego_ahga?.reiniciar_ahga();
    // });

    // Evento cerrar sesión
    // this.btnSalir?.addEventListener("click", async () => {
     //   await cerrarSesion_ahga();
     // });

    // Eventos de teclado para el juego
    document.addEventListener("keydown", (evento_ahga) => {
      this.juego_ahga?.manejarTecla_ahga?.(evento_ahga);

      // Cerrar modales con Escape
      if (evento_ahga.key === "Escape") {
        const modales = document.querySelectorAll(".modal");
        modales.forEach((modal) => {
          if (modal.style.display === "flex") {
            modal.style.display = "none";
          }
        });
      }
    });

    // Login
    const formularioLogin_ahga = document.querySelector("#loginForm form");
    if (formularioLogin_ahga) {
      formularioLogin_ahga.addEventListener("submit", async (evento_ahga) => {
        evento_ahga.preventDefault();
        const email_ahga = document.getElementById("email").value;
        const contrasena_ahga = document.getElementById("password").value;
        try {
          await iniciarSesion_ahga(email_ahga, contrasena_ahga);
        } catch (error_ahga) {
          alert("Error en login: " + error_ahga.message);
        }
      });
    }

    // Registro
    const formularioRegistro_ahga =
      document.querySelector("#registerForm form");
    if (formularioRegistro_ahga) {
      formularioRegistro_ahga.addEventListener(
        "submit",
        async (evento_ahga) => {
          evento_ahga.preventDefault();
          const email_ahga = document.getElementById("regEmail").value;
          const contrasena_ahga = document.getElementById("regPassword").value;
          const confirmarContrasena_ahga =
            document.getElementById("confirmPassword").value;
          const nombre_ahga = document.getElementById("firstName").value;
          const apellido_ahga = document.getElementById("lastName").value;
          const nombreUsuario_ahga = document.getElementById("username").value;
          const fechaNacimiento_ahga =
            document.getElementById("birthDate").value;
          const aceptarTerminos_ahga = document.getElementById("terms").checked;

          if (contrasena_ahga !== confirmarContrasena_ahga) {
            alert("⚠️ Las contraseñas no coinciden.");
            return;
          }
          if (!aceptarTerminos_ahga) {
            alert("⚠️ Debes aceptar los términos y condiciones.");
            return;
          }

          try {
            await registrarUsuario_ahga(email_ahga, contrasena_ahga, {
              nombre: nombre_ahga,
              apellido: apellido_ahga,
              nombreUsuario: nombreUsuario_ahga,
              fechaNacimiento: fechaNacimiento_ahga,
              rol: "usuario",
            });
            alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
            formularioRegistro_ahga.reset();
          } catch (error_ahga) {
            alert("Error en registro: " + error_ahga.message);
          }
        }
      );
    }
  }

  // Mostrar modal de selección de equipo para jugador 1
  async mostrarSeleccionEquipo() {
    return new Promise((resolve) => {
      console.log("Mostrando modal de selección de equipo para Jugador 1...");
      const modal = document.getElementById("modalSeleccionEquipo_ah_ga");
      const btnAtacantes = document.getElementById("atacantesBtn_ah_ga");
      const btnDefensores = document.getElementById("defensoresBtn_ah_ga");
      
      if (!modal || !btnAtacantes || !btnDefensores) {
        console.error("Modal de selección de equipo no encontrado");
        // Si no se encuentra el modal, usar configuración por defecto
        this.equipoJugador1 = "soldado";
        resolve();
        return;
      }

      modal.classList.remove("hidden");

      const manejarSeleccionJugador1 = (equipoSeleccionado) => {
        this.equipoJugador1 = equipoSeleccionado;
        
        console.log("Jugador 1 eligió:", {
          equipo: this.equipoJugador1
        });
        
        modal.classList.add("hidden");
        document.body.style.overflow = ""; // Restaurar scroll
        resolve();
      };

      btnAtacantes.onclick = () => manejarSeleccionJugador1("soldado");
      btnDefensores.onclick = () => manejarSeleccionJugador1("oficial");
    });
  }

  // Mostrar modal de modo de juego para jugador 2
  async mostrarModoJuego() {
    return new Promise((resolve) => {
      console.log("Mostrando modal de modo de juego para Jugador 2...");
      const modal = document.getElementById("modalModoJuego_ah_ga");
      const btnInvitado = document.getElementById("invitadoBtn_ah_ga");
      const btnRegistrado = document.getElementById("registradoBtn_ah_ga");
      
      if (!modal || !btnInvitado || !btnRegistrado) {
        console.error("Modal de modo de juego no encontrado");
        // Si no se encuentra el modal, usar configuración por defecto
        this.modoJuego = "invitado";
        resolve();
        return;
      }

      modal.classList.remove("hidden");

      const manejarSeleccionModo = (modoSeleccionado) => {
        this.modoJuego = modoSeleccionado;
        
        console.log("Modo de juego seleccionado:", this.modoJuego);
        
        modal.classList.add("hidden");
        document.body.style.overflow = ""; // Restaurar scroll
        resolve();
      };

      btnInvitado.onclick = () => manejarSeleccionModo("invitado");
      btnRegistrado.onclick = () => manejarSeleccionModo("registrado");
    });
  }

  // Configurar equipo del jugador 2 automáticamente
  async configurarEquipoJugador2() {
    // Asignar automáticamente el equipo opuesto al jugador 1
    this.equipoJugador2 = this.equipoJugador1 === "soldado" ? "oficial" : "soldado";
    
    console.log("Equipos finales configurados:", {
      jugador1: this.equipoJugador1,
      jugador2: this.equipoJugador2
    });
    
    return Promise.resolve();
  }

  // Mostrar modal de login del jugador 2
  async mostrarLoginJugador2() {
    return new Promise((resolve, reject) => {
      const modal = document.getElementById("modalLoginJugador2_ah_ga");
      const form = document.getElementById("formLoginJugador2_ah_ga");
      const btnCerrar = document.getElementById("cancelarLoginJugador2_ah_ga");

      modal.classList.remove("hidden");

      form.onsubmit = async (e) => {
        e.preventDefault();

        const email = document.getElementById("emailJugador2_ah_ga").value;
          const password = document.getElementById("passwordJugador2_ah_ga").value;

        try {
          // Validar credenciales del jugador 2 consultando directamente Firestore
          const datosUsuario = await validarCredencialesFirestore_ahga(
            email,
            password
          );

          if (datosUsuario) {
            // Configuramos el jugador 2
            this.jugador2 = {
              id: datosUsuario.uid,
              nombre: datosUsuario.nombre || datosUsuario.email,
              esInvitado: false,
            };

            modal.classList.add("hidden");
            document.body.style.overflow = ""; // Restaurar scroll
            resolve();
          } else {
            this.modal.showError_ahga(
              "Error de Login",
              "Credenciales incorrectas. Verifica tu email y contraseña."
            );
          }
        } catch (error) {
          console.error("Error en login jugador 2:", error);
          this.modal.showError_ahga(
            "Error de Login",
            "Error al validar las credenciales del jugador 2."
          );
        }
      };

      btnCerrar.onclick = () => {
        // Configurar jugador 2 como invitado
        this.jugador2 = {
          id: null,
          nombre: "Invitado",
          esInvitado: true,
        };

        modal.classList.add("hidden");
        document.body.style.overflow = ""; // Restaurar scroll
        resolve();
      };
    });
  }

  // Registrar resultado de la partida
  async registrarResultadoPartida(ganador, equipoGanador, tipoVictoria) {
    try {
      // Verificar que el usuario esté autenticado
      if (!this.usuarioActual || !this.usuarioActual.uid) {
        console.log("Usuario no autenticado, no se puede registrar la partida");
        return;
      }

      // Determinar el ganador real para el registro
      let ganadorReal = ganador;

      // Si el ganador es 'invitado', significa que ganó el jugador 2 invitado
      // En este caso, el ganador real es null (no registrado) pero registramos la partida
      if (ganador === "invitado") {
        ganadorReal = null; // No hay ID de usuario ganador
      }

      const datosPartida = {
        jugador1Id: this.usuarioActual.uid,
        jugador1Nombre: this.usuarioActual.nombre || this.usuarioActual.email,
        jugador1Equipo: this.equipoJugador1,
        jugador2Id: this.jugador2?.id || null,
        jugador2Nombre: this.jugador2?.nombre || "Invitado",
        jugador2Equipo: this.equipoJugador2,
        ganador: ganadorReal,
        equipoGanador: equipoGanador,
        tipoVictoria: tipoVictoria,
        duracionMinutos: Math.round(
          (Date.now() - this.tiempoInicioPartida_ahga) / 60000
        ),
        // Agregar información adicional para casos especiales
        ganadorEsInvitado: ganador === "invitado",
      };

      const partidaId = await guardarPartida_ahga(datosPartida);
      console.log("Partida registrada con ID:", partidaId);

      // Mostrar mensaje de éxito
      if (ganador === "invitado") {
        this.modal.showSuccess_ahga(
          "Partida Finalizada",
          "¡El invitado ha ganado! La partida ha sido registrada."
        );
      } else if (ganador === this.usuarioActual.uid) {
        this.modal.showSuccess_ahga(
          "¡Victoria!",
          "¡Has ganado! Tu victoria ha sido registrada."
        );
      } else {
        this.modal.showSuccess_ahga(
          "Partida Finalizada",
          "¡Partida completada! El resultado ha sido registrado."
        );
      }

      // Actualizar estadísticas en sessionStorage después de registrar la partida
      await this.actualizarEstadisticasSessionStorage();

      return partidaId;
    } catch (error) {
      console.error("Error al registrar partida:", error);
      this.modal.showError_ahga(
        "Error",
        "Error al guardar el resultado de la partida."
      );
      throw error;
    }
  }

  // Función para actualizar las estadísticas en sessionStorage
  async actualizarEstadisticasSessionStorage() {
    try {
      console.log("🔄 Actualizando estadísticas en sessionStorage...");
      console.log("Usuario ID:", this.usuarioActual?.uid);
      
      if (!this.usuarioActual?.uid) {
        console.log("❌ No hay usuario autenticado");
        return;
      }

      // Obtener estadísticas actualizadas de Firebase
      const estadisticasActualizadas = await obtenerEstadisticasJugador_ahga(this.usuarioActual.uid);
      console.log("📊 Estadísticas obtenidas de Firebase:", estadisticasActualizadas);

      // Obtener datos actuales del usuario desde sessionStorage
      const datosUsuarioActuales = JSON.parse(sessionStorage.getItem('datosUsuario_ahga') || '{}');
      console.log("👤 Datos actuales en sessionStorage:", datosUsuarioActuales);

      // Actualizar las estadísticas en los datos del usuario
      const datosUsuarioActualizados = {
        ...datosUsuarioActuales,
        estadisticas: estadisticasActualizadas || {
          partidasJugadas: 0,
          partidasGanadas: 0,
          partidasPerdidas: 0,
          victoriasComoAtacante: 0,
          victoriasComoDefensor: 0,
          derrotasComoAtacante: 0,
          derrotasComoDefensor: 0
        }
      };

      console.log("💾 Guardando datos actualizados en sessionStorage:", datosUsuarioActualizados);
      
      // Guardar en sessionStorage
       sessionStorage.setItem('datosUsuario_ahga', JSON.stringify(datosUsuarioActualizados));
       
       // Verificar que se guardó correctamente
       const verificacion = JSON.parse(sessionStorage.getItem('datosUsuario_ahga') || '{}');
       console.log("✅ Verificación - datos guardados:", verificacion);
       
       // Actualizar también this.usuarioActual
       this.usuarioActual = datosUsuarioActualizados;
       
       // Disparar evento storage manualmente (ya que no se dispara automáticamente en la misma pestaña)
       console.log("📡 Disparando evento storage manual");
       window.dispatchEvent(new StorageEvent('storage', {
         key: 'datosUsuario_ahga',
         newValue: JSON.stringify(datosUsuarioActualizados),
         oldValue: JSON.stringify(datosUsuarioActuales),
         storageArea: sessionStorage
       }));
       
       // Disparar evento personalizado para notificar a ver-perfil.js
       console.log("📡 Disparando evento actualizarPerfil_ahga");
       window.dispatchEvent(new CustomEvent('actualizarPerfil_ahga', {
         detail: { estadisticas: estadisticasActualizadas }
       }));
      
    } catch (error) {
      console.error("❌ Error al actualizar estadísticas en sessionStorage:", error);
    }
  }

  // Mostrar estadísticas de los jugadores
  async mostrarEstadisticasJugadores() {
    try {
      // Obtener estadísticas del jugador 1 (usuario logueado)
      const estadisticasJugador1 = await obtenerEstadisticasJugador_ahga(
        this.usuarioActual.uid
      );

      let estadisticasJugador2 = null;
      // Solo obtener estadísticas del jugador 2 si está registrado
      if (this.jugador2.id) {
        estadisticasJugador2 = await obtenerEstadisticasJugador_ahga(
          this.jugador2.id
        );
      }

      // Crear contenido del modal con las estadísticas
      const contenidoModal = this.crearContenidoEstadisticas(
        estadisticasJugador1,
        estadisticasJugador2
      );

      // Mostrar modal con las estadísticas
      return new Promise((resolve) => {
        this.modal.showSuccess_ahga(
          "Estadísticas de Jugadores",
          contenidoModal,
          () => {
            resolve();
          }
        );

        // Auto-cerrar después de 5 segundos si no se hace clic
        setTimeout(() => {
          resolve();
        }, 5000);
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      // Si hay error, continuar sin mostrar estadísticas
    }
  }

  // Crear contenido HTML para mostrar las estadísticas
  crearContenidoEstadisticas(estadisticasJ1, estadisticasJ2) {
    const nombreJ1 = this.usuarioActual.nombre || this.usuarioActual.email;
    const nombreJ2 = this.jugador2.nombre;

    // Estadísticas por defecto si no existen
    const statsJ1 = estadisticasJ1 || {
      partidasJugadas: 0,
      partidasGanadas: 0,
      partidasPerdidas: 0,
    };

    let contenido = `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h3 style="color: #2c3e50; margin-bottom: 20px;">📊 Estadísticas de Jugadores</h3>
        
        <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
          <div style="background: #3498db; color: white; padding: 15px; border-radius: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0;">🎮 ${nombreJ1}</h4>
            <p style="margin: 5px 0;">🏆 Victorias: <strong>${statsJ1.partidasGanadas}</strong></p>
            <p style="margin: 5px 0;">📊 Partidas: <strong>${statsJ1.partidasJugadas}</strong></p>
            <p style="margin: 5px 0;">💔 Derrotas: <strong>${statsJ1.partidasPerdidas}</strong></p>
          </div>`;

    if (estadisticasJ2) {
      const statsJ2 = estadisticasJ2 || {
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
      };

      contenido += `
          <div style="background: #e74c3c; color: white; padding: 15px; border-radius: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0;">🎮 ${nombreJ2}</h4>
            <p style="margin: 5px 0;">🏆 Victorias: <strong>${statsJ2.partidasGanadas}</strong></p>
            <p style="margin: 5px 0;">📊 Partidas: <strong>${statsJ2.partidasJugadas}</strong></p>
            <p style="margin: 5px 0;">💔 Derrotas: <strong>${statsJ2.partidasPerdidas}</strong></p>
          </div>`;
    } else {
      contenido += `
          <div style="background: #95a5a6; color: white; padding: 15px; border-radius: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0;">👤 ${nombreJ2}</h4>
            <p style="margin: 5px 0;">🆕 Jugador Invitado</p>
            <p style="margin: 5px 0;">📊 Sin estadísticas</p>
            <p style="margin: 5px 0;">💡 Regístrate para guardar tus victorias</p>
          </div>`;
    }

    contenido += `
        </div>
        <p style="color: #7f8c8d; font-size: 14px; margin-top: 15px;">
          ⚡ ¡Que comience la batalla! ⚡
        </p>
      </div>`;

    return contenido;
  }

  // Mostrar loader de carga
  mostrarLoader() {
    const loader = document.createElement("div");
    loader.id = "gameLoader_ahga";
    loader.className =
      "fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50";
    
    // Permitir scroll en el body mientras el loader está activo
    loader.style.overflowY = "auto";

    loader.innerHTML = `
      <div class="text-center text-white">
        <div class="mb-8">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
        <h3 class="text-2xl font-bold mb-4 text-blue-400">⚔️ Preparando Batalla</h3>
        <p class="text-gray-300 text-lg mb-2">Cargando tablero y piezas...</p>
        <div class="flex justify-center space-x-2 mt-4">
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    `;

    document.body.appendChild(loader);
    return loader;
  }

  // Ocultar loader de carga
  ocultarLoader() {
    const loader = document.getElementById("gameLoader_ahga");
    if (loader) {
      loader.remove();
    }
  }

  async iniciarJuego_ahga() {
    let loader = null;
    try {
      // Verificar que estamos en la página correcta
      if (!window.location.pathname.includes('juego.html')) {
        console.log("Redirigiendo a la página del juego...");
        window.location.href = './dist/juego.html';
        return;
      }
      
      // Verificar que el usuario esté autenticado o simular usuario para demo
      if (!this.usuarioActual || !this.usuarioActual.uid) {
        console.log("Simulando usuario para demo automática...");
        // Simular usuario autenticado para demo
        this.usuarioActual = {
          uid: "demo_user_123",
          nombre: "Jugador Demo",
          email: "demo@ejemplo.com"
        };
      }

      // Mostrar modal de selección de equipo para jugador 1
      await this.mostrarSeleccionEquipo();

      // Mostrar modal de modo de juego para jugador 2
      await this.mostrarModoJuego();

      // Configurar automáticamente el equipo del jugador 2 (opuesto al jugador 1)
      await this.configurarEquipoJugador2();

      // Si es modo registrado, mostrar login del jugador 2
      if (this.modoJuego === "registrado") {
        await this.mostrarLoginJugador2();
      } else {
        // Configurar jugador 2 como invitado
        this.jugador2 = {
          id: null,
          nombre: "Invitado",
          esInvitado: true,
        };
      }

      // Mostrar loader inmediatamente después de configurar el jugador 2
      loader = this.mostrarLoader();

      // Mostrar estadísticas de los jugadores antes de iniciar
      await this.mostrarEstadisticasJugadores();

      // Simular tiempo de carga para que el usuario vea el loader
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Actualizar información de jugadores en la interfaz
      this.actualizarInfoJugadores();
      
      // Inicializar el juego con los equipos seleccionados
      this.tiempoInicioPartida_ahga = Date.now();

      if (!this.juego_ahga) {
        this.juego_ahga = new ControladorJuego_ahga(this.canvas_ahga);
        // Note: ControladorJuego_ahga initializes the game automatically in constructor
        // Player configuration is not needed for this game type
        
        // Ejecutar reiniciarPartida_ahga automáticamente
        this.juego_ahga.reiniciarPartida_ahga();
        
        // Establecer callback para cuando termine la partida
        this.juego_ahga.establecerCallbackResultado(
          (ganadorId, equipoGanador, tipoVictoria) => {
            // Determinar el ganador real basado en el equipo ganador y los equipos asignados
            let ganadorReal = null;
            
            if (equipoGanador === this.equipoJugador1) {
              ganadorReal = this.usuarioActual.uid;
            } else if (equipoGanador === this.equipoJugador2) {
              ganadorReal = this.jugador2?.id || "invitado";
            }
            
            this.registrarResultadoPartida(
              ganadorReal,
              equipoGanador,
              tipoVictoria
            );
          }
        );

        console.log("🎮 Juego iniciado desde App_ahga");
      }

      // Ocultar loader después de que el juego esté listo
      this.ocultarLoader();
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
      this.ocultarLoader(); // Asegurar que se oculte el loader en caso de error
      this.modal.showError_ahga(
        "Error",
        "Error al iniciar el juego. Por favor, intenta de nuevo."
      );
    }
  }

  destruirJuego_ahga() {
    if (this.juego_ahga) {
      this.juego_ahga = null;
    }
  }

  mostrarPantallaLogin() {
    this.pantallaLogin?.classList.remove("hidden");
    this.pantallaJuego?.classList.add("hidden");
  }

  mostrarPantallaJuego() {
    this.pantallaLogin?.classList.add("hidden");
    this.pantallaJuego?.classList.remove("hidden");
  }

  // Actualizar información de jugadores en la interfaz
  actualizarInfoJugadores() {
    const jugador1Info = document.getElementById("jugador1-info");
    const jugador2Info = document.getElementById("jugador2-info");

    if (jugador1Info) {
      const nombreJ1 = this.usuarioActual?.nombre || this.usuarioActual?.email || "Jugador 1";
      const equipoJ1 = this.equipoJugador1 === "soldado" ? "Atacantes" : "Defensores";
      jugador1Info.innerHTML = `
        <div class="text-center">
          <h3 class="text-lg font-bold text-blue-400">${nombreJ1}</h3>
          <p class="text-sm text-gray-300">${equipoJ1}</p>
        </div>
      `;
    }

    if (jugador2Info) {
      const nombreJ2 = this.jugador2?.nombre || "Jugador 2";
      const equipoJ2 = this.equipoJugador2 === "soldado" ? "Atacantes" : "Defensores";
      const tipoJ2 = this.jugador2?.esInvitado ? "(Invitado)" : "(Registrado)";
      jugador2Info.innerHTML = `
        <div class="text-center">
          <h3 class="text-lg font-bold text-red-400">${nombreJ2}</h3>
          <p class="text-sm text-gray-300">${equipoJ2} ${tipoJ2}</p>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App_ahga();
  
  // Simular click en el botón Nueva Partida automáticamente
  setTimeout(() => {
    const btnNuevaPartida = document.getElementById("nuevoJuegoBtn_ah_ga");
    if (btnNuevaPartida) {
      btnNuevaPartida.click();
      console.log('Botón Nueva Partida clickeado automáticamente');
    } else {
      console.error('No se encontró el botón Nueva Partida');
    }
  }, 500); // Esperar 500ms para asegurar que el DOM esté completamente cargado
});
