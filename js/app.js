// app.js
import { ControladorJuego_ah_ga } from "./administradorJuego.js";
import { auth_ahga } from "../firebase/services/index.js";
import {
  iniciarSesion_ahga,
  registrarUsuario_ahga,
  cerrarSesion_ahga,
} from "../firebase/services/auth.service.js";
import { guardarPartida_ahga, obtenerEstadisticasJugador_ahga } from '../firebase/services/partidas.service.js';
import { obtenerUsuario_ahga, validarCredencialesFirestore_ahga } from '../firebase/services/firestore.service.js';
import { ModalDialog_ah_ga, modal_ah_ga } from './modal.js';

class UIHandler_ah_ga {
  constructor() {
    this.contadorSoldados_ah_ga = document.getElementById(
      "contadorSoldados_ah_ga"
    );
    this.contadorOficiales_ah_ga = document.getElementById(
      "contadorOficiales_ah_ga"
    );
  }

  actualizarEstadisticas_ah_ga(cantSoldados, cantOficiales) {
    if (this.contadorSoldados_ah_ga) {
      this.contadorSoldados_ah_ga.textContent = cantSoldados;
    }
    if (this.contadorOficiales_ah_ga) {
      this.contadorOficiales_ah_ga.textContent = cantOficiales;
    }
  }



  mostrarReglas_ah_ga() {
    // Crear modal con Tailwind CSS y tema oscuro
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gray-900 rounded-2xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-gray-700';
    
    modalContent.innerHTML = `
      <div class="text-left text-gray-100 leading-relaxed">
        <h3 class="text-3xl font-bold text-center mb-8 text-blue-400">📋 REGLAS DEL JUEGO ASALTO</h3>
        
        <div class="mb-6">
          <h4 class="text-xl font-semibold mb-3 text-cyan-400">🎯 1. OBJETIVOS:</h4>
          <ul class="ml-6 space-y-2">
            <li class="text-gray-300"><span class="font-bold text-white">Atacantes (Soldados):</span> Ocupar la fortaleza o capturar ambos oficiales</li>
            <li class="text-gray-300"><span class="font-bold text-white">Defensores (Oficiales):</span> Eliminar suficientes soldados (menos de 9)</li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h4 class="text-xl font-semibold mb-3 text-red-400">🚶 2. MOVIMIENTOS:</h4>
          <ul class="ml-6 space-y-2">
            <li class="text-gray-300"><span class="font-bold text-white">Soldados:</span> Avanzan hacia arriba o lateralmente</li>
            <li class="text-gray-300"><span class="font-bold text-white">Oficiales:</span> Se mueven en cualquier dirección y capturan saltando</li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h4 class="text-xl font-semibold mb-3 text-green-400">⏰ 3. TURNOS:</h4>
          <ul class="ml-6 space-y-2">
            <li class="text-gray-300">Alternados entre atacantes y defensores</li>
            <li class="text-gray-300">Selecciona tu pieza y luego la casilla destino</li>
          </ul>
        </div>
        
        <p class="text-center text-gray-400 italic mt-8 text-lg">
          ¡Que comience la batalla estratégica! ⚔️
        </p>
        
        <div class="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-700">
          <button id="btnRegresar" 
                  class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            🏠 Regresar a la Página Principal
          </button>
          <button id="btnCerrar" 
                  class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            ✖️ Cerrar
          </button>
        </div>
      </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Eventos para cerrar el modal
    const btnCerrar = modalContent.querySelector('#btnCerrar');
    const btnRegresar = modalContent.querySelector('#btnRegresar');
    
    btnCerrar.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
    });
    
    btnRegresar.addEventListener('click', () => {
      window.location.href = './index.html';
    });
    
    // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
    
    // Cerrar con tecla Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modalOverlay);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }
}

class App_ah_ga {
  constructor() {
    // === Referencias DOM principales ===
    this.canvas_ah_ga = document.getElementById("canvasJuego_ah_ga");
    this.btnAyuda_ah_ga = document.getElementById("botonAyuda_ah_ga");
    this.btnReiniciar_ah_ga = document.getElementById("botonReiniciar_ah_ga");
    this.pantallaLogin = document.getElementById("pantallaLogin");
    this.pantallaJuego = document.getElementById("pantallaJuego");
    this.btnSalir = document.getElementById("botonSalir");

    this.ui_ah_ga = new UIHandler_ah_ga();
    this.juego_ah_ga = null;
    this.usuarioActual = null;
    this.jugador2 = null;
    this.equipoJugador1 = null;
    this.equipoJugador2 = null;
    this.modoJuego = null; // 'invitado' o 'registrado'
    this.tiempoInicioPartida_ah_ga = null;
    this.modal = new ModalDialog_ah_ga();

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

          // Combinar datos de Firebase Auth con Firestore
          const datosCompletosUsuario_ahga = {
            uid: usuario_ahga.uid,
            email: usuario_ahga.email,
            emailVerificado: usuario_ahga.emailVerified,
            ...datosUsuario_ahga,
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
          };
          sessionStorage.setItem(
            "datosUsuario_ahga",
            JSON.stringify(datosBasicosUsuario_ahga)
          );
          
          this.usuarioActual = datosBasicosUsuario_ahga;
        }

        this.mostrarPantallaJuego();
        this.iniciarJuego_ah_ga();
      } else {
        console.log("⚠️ No hay usuario logueado, mostrar pantalla login");

        // Limpiar sessionStorage y usuarioActual
        sessionStorage.removeItem("datosUsuario_ahga");
        sessionStorage.removeItem("tokenAuth_ahga");
        this.usuarioActual = null;

        this.mostrarPantallaLogin();
        this.destruirJuego_ah_ga();
      }
    });

    this.conectarEventos_ah_ga();
  }

  conectarEventos_ah_ga() {
    // Botón ayuda
    this.btnAyuda_ah_ga?.addEventListener("click", () => {
      this.ui_ah_ga.mostrarReglas_ah_ga();
      console.log("reglas");
    });

    // Botón reiniciar
    this.btnReiniciar_ah_ga?.addEventListener("click", () => {
      this.juego_ah_ga?.reiniciar_ah_ga();
    });

    // Evento cerrar sesión
    this.btnSalir?.addEventListener("click", async () => {
      await cerrarSesion_ahga();
    });

    // Eventos de teclado para el juego
    document.addEventListener("keydown", (evento_ahga) => {
      this.juego_ah_ga?.manejarTecla_ah_ga?.(evento_ahga);
      
      // Cerrar modales con Escape
      if (evento_ahga.key === 'Escape') {
        const modales = document.querySelectorAll('.modal');
        modales.forEach(modal => {
          if (modal.style.display === 'flex') {
            modal.style.display = 'none';
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

  // Mostrar modal de selección de equipo
   async mostrarSeleccionEquipo() {
     return new Promise((resolve) => {
       const modal = document.getElementById('modalSeleccionEquipo_ah_ga');
       const btnAtacantes = document.getElementById('seleccionarAtacantes_ah_ga');
       const btnDefensores = document.getElementById('seleccionarDefensores_ah_ga');
       
       modal.classList.remove('hidden');
       
       const manejarSeleccion = (equipo) => {
         this.equipoJugador1 = equipo;
         this.equipoJugador2 = equipo === 'soldado' ? 'oficial' : 'soldado';
         modal.classList.add('hidden');
         resolve();
       };
       
       btnAtacantes.onclick = () => manejarSeleccion('soldado');
       btnDefensores.onclick = () => manejarSeleccion('oficial');
     });
   }

  // Mostrar modal de modo de juego
   async mostrarModoJuego() {
     return new Promise((resolve) => {
       const modal = document.getElementById('modalModoJuego_ah_ga');
       const btnInvitado = document.getElementById('modoInvitado_ah_ga');
       const btnRegistrado = document.getElementById('modoRegistrado_ah_ga');
       
       modal.classList.remove('hidden');
       
       const manejarModo = (modo) => {
         this.modoJuego = modo;
         modal.classList.add('hidden');
         resolve();
       };
       
       btnInvitado.onclick = () => manejarModo('invitado');
       btnRegistrado.onclick = () => manejarModo('registrado');
     });
   }

  // Mostrar modal de login del jugador 2
   async mostrarLoginJugador2() {
     return new Promise((resolve, reject) => {
       const modal = document.getElementById('modalLoginJugador2_ah_ga');
       const form = document.getElementById('formLoginJugador2_ah_ga');
       const btnCerrar = document.getElementById('cancelarLoginJugador2_ah_ga');
       
       modal.classList.remove('hidden');
       
       form.onsubmit = async (e) => {
         e.preventDefault();
         
         const email = document.getElementById('emailJugador2_ah_ga').value;
         const password = document.getElementById('passwordJugador2_ah_ga').value;
         
         try {
              // Validar credenciales del jugador 2 consultando directamente Firestore
              const datosUsuario = await validarCredencialesFirestore_ahga(email, password);
              
              if (datosUsuario) {
                // Configuramos el jugador 2
                this.jugador2 = {
                  id: datosUsuario.uid,
                  nombre: datosUsuario.nombre || datosUsuario.email,
                  esInvitado: false
                };
                
                modal.classList.add('hidden');
                resolve();
              } else {
                this.modal.showError_ah_ga('Error de Login', 'Credenciales incorrectas. Verifica tu email y contraseña.');
              }
          } catch (error) {
            console.error('Error en login jugador 2:', error);
            this.modal.showError_ah_ga('Error de Login', 'Error al validar las credenciales del jugador 2.');
          }
       };
       
       btnCerrar.onclick = () => {
         // Configurar jugador 2 como invitado
         this.jugador2 = {
           id: null,
           nombre: 'Invitado',
           esInvitado: true
         };
         
         modal.classList.add('hidden');
         resolve();
       };
     });
   }

  // Registrar resultado de la partida
   async registrarResultadoPartida(ganador, equipoGanador, tipoVictoria) {
     try {
       // Verificar que el usuario esté autenticado
       if (!this.usuarioActual || !this.usuarioActual.uid) {
         console.log('Usuario no autenticado, no se puede registrar la partida');
         return;
       }
       
       // Determinar el ganador real para el registro
       let ganadorReal = ganador;
       
       // Si el ganador es 'invitado', significa que ganó el jugador 2 invitado
       // En este caso, el ganador real es null (no registrado) pero registramos la partida
       if (ganador === 'invitado') {
         ganadorReal = null; // No hay ID de usuario ganador
       }
       
       const datosPartida = {
         jugador1Id: this.usuarioActual.uid,
         jugador1Nombre: this.usuarioActual.nombre || this.usuarioActual.email,
         jugador1Equipo: this.equipoJugador1,
         jugador2Id: this.jugador2?.id || null,
         jugador2Nombre: this.jugador2?.nombre || 'Invitado',
         jugador2Equipo: this.equipoJugador2,
         ganador: ganadorReal,
         equipoGanador: equipoGanador,
         tipoVictoria: tipoVictoria,
         duracionMinutos: Math.round((Date.now() - this.tiempoInicioPartida_ah_ga) / 60000),
         // Agregar información adicional para casos especiales
         ganadorEsInvitado: ganador === 'invitado'
       };
       
       const partidaId = await guardarPartida_ahga(datosPartida);
       console.log('Partida registrada con ID:', partidaId);
       
       // Mostrar mensaje de éxito
       if (ganador === 'invitado') {
         this.modal.showSuccess_ah_ga('Partida Finalizada', '¡El invitado ha ganado! La partida ha sido registrada.');
       } else if (ganador === this.usuarioActual.uid) {
         this.modal.showSuccess_ah_ga('¡Victoria!', '¡Has ganado! Tu victoria ha sido registrada.');
       } else {
         this.modal.showSuccess_ah_ga('Partida Finalizada', '¡Partida completada! El resultado ha sido registrado.');
       }
       
       return partidaId;
     } catch (error) {
       console.error('Error al registrar partida:', error);
       this.modal.showError_ah_ga('Error', 'Error al guardar el resultado de la partida.');
       throw error;
     }
   }

  // Mostrar estadísticas de los jugadores
  async mostrarEstadisticasJugadores() {
    try {
      // Obtener estadísticas del jugador 1 (usuario logueado)
      const estadisticasJugador1 = await obtenerEstadisticasJugador_ahga(this.usuarioActual.uid);
      
      let estadisticasJugador2 = null;
      // Solo obtener estadísticas del jugador 2 si está registrado
      if (this.jugador2.id) {
        estadisticasJugador2 = await obtenerEstadisticasJugador_ahga(this.jugador2.id);
      }
      
      // Crear contenido del modal con las estadísticas
      const contenidoModal = this.crearContenidoEstadisticas(estadisticasJugador1, estadisticasJugador2);
      
      // Mostrar modal con las estadísticas
      return new Promise((resolve) => {
        this.modal.showSuccess_ah_ga('Estadísticas de Jugadores', contenidoModal, () => {
          resolve();
        });
        
        // Auto-cerrar después de 5 segundos si no se hace clic
        setTimeout(() => {
          resolve();
        }, 5000);
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
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
      partidasPerdidas: 0
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
        partidasPerdidas: 0
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
    const loader = document.createElement('div');
    loader.id = 'gameLoader_ah_ga';
    loader.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
    
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
    const loader = document.getElementById('gameLoader_ah_ga');
    if (loader) {
      loader.remove();
    }
  }

  async iniciarJuego_ah_ga() {
    let loader = null;
    try {
      // Verificar que el usuario esté autenticado
      if (!this.usuarioActual || !this.usuarioActual.uid) {
        console.log('Usuario no autenticado, esperando autenticación...');
        return;
      }
      
      // Mostrar modal de selección de equipo
      await this.mostrarSeleccionEquipo();
      
      // Mostrar modal de modo de juego
      await this.mostrarModoJuego();
      
      // Si es modo registrado, mostrar login del jugador 2
      if (this.modoJuego === 'registrado') {
        await this.mostrarLoginJugador2();
      } else {
        // Configurar jugador 2 como invitado
        this.jugador2 = {
          id: null,
          nombre: 'Invitado',
          esInvitado: true
        };
      }
      
      // Mostrar loader inmediatamente después de configurar el jugador 2
      loader = this.mostrarLoader();
      
      // Mostrar estadísticas de los jugadores antes de iniciar
      await this.mostrarEstadisticasJugadores();
      
      // Simular tiempo de carga para que el usuario vea el loader
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Inicializar el juego con los equipos seleccionados
      this.tiempoInicioPartida_ah_ga = Date.now();
      
      if (!this.juego_ah_ga) {
        this.juego_ah_ga = new ControladorJuego_ah_ga(this.canvas_ah_ga);
        this.juego_ah_ga.configurarJugadores({
           jugador1: {
             id: this.usuarioActual.uid,
             nombre: this.usuarioActual.nombre || this.usuarioActual.email,
             equipo: this.equipoJugador1
           },
           jugador2: {
             id: this.jugador2.id,
             nombre: this.jugador2.nombre,
             equipo: this.equipoJugador2,
             esInvitado: this.jugador2.esInvitado
           }
         });
         
         // Establecer callback para cuando termine la partida
         this.juego_ah_ga.establecerCallbackResultado((ganadorId, equipoGanador, tipoVictoria) => {
           this.registrarResultadoPartida(ganadorId, equipoGanador, tipoVictoria);
         });
         
         console.log("🎮 Juego iniciado desde App_ah_ga");
         this.juego_ah_ga.iniciar_ah_ga?.();
      }
      
      // Ocultar loader después de que el juego esté listo
      this.ocultarLoader();
      
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
      this.ocultarLoader(); // Asegurar que se oculte el loader en caso de error
      this.modal.showError_ah_ga('Error', 'Error al iniciar el juego. Por favor, intenta de nuevo.');
    }
  }

  destruirJuego_ah_ga() {
    if (this.juego_ah_ga) {
      this.juego_ah_ga = null;
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
}

document.addEventListener("DOMContentLoaded", () => {
  new App_ah_ga();
});
