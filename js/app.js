// app.js
import { ControladorJuego_ah_ga } from "./administradorJuego.js";
import { auth_ahga } from "../firebase/services/index.js";
import {
  iniciarSesion_ahga,
  registrarUsuario_ahga,
  cerrarSesion_ahga,
} from "../firebase/services/auth.service.js";

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
    alert(`REGLAS DEL JUEGO ASALTO:

1. OBJETIVOS:
    - Atacantes (Soldados): Ocupar la fortaleza o capturar ambos oficiales
    - Defensores (Oficiales): Eliminar suficientes soldados (menos de 9)

2. MOVIMIENTOS:
    - Soldados: Avanzan hacia arriba o lateralmente
    - Oficiales: Se mueven en cualquier dirección y capturan saltando

3. TURNOS:
    - Alternados entre atacantes y defensores
    - Selecciona tu pieza y luego la casilla destino`);
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

          // Guardar en sessionStorage
          sessionStorage.setItem(
            "datosUsuario_ahga",
            JSON.stringify(datosCompletosUsuario_ahga)
          );

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
        }

        this.mostrarPantallaJuego();
        this.iniciarJuego_ah_ga();
      } else {
        console.log("⚠️ No hay usuario logueado, mostrar pantalla login");

        // Limpiar sessionStorage
        sessionStorage.removeItem("datosUsuario_ahga");
        sessionStorage.removeItem("tokenAuth_ahga");

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

  iniciarJuego_ah_ga() {
    if (!this.juego_ah_ga) {
      this.juego_ah_ga = new ControladorJuego_ah_ga(this.canvas_ah_ga);
      console.log("🎮 Juego iniciado desde App_ah_ga");
      this.juego_ah_ga.iniciar_ah_ga?.();
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
