// app.js
import { ControladorJuego_ah_ga } from './administradorJuego.js';
import { auth } from '../firebase/firebase.js';
import { iniciarSesion, registrarUsuario, cerrarSesion } from '../firebase/auth.js';

class UIHandler_ah_ga {
    constructor() {
        this.contadorSoldados_ah_ga = document.getElementById('contadorSoldados_ah_ga');
        this.contadorOficiales_ah_ga = document.getElementById('contadorOficiales_ah_ga');
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
        this.canvas_ah_ga = document.getElementById('canvasJuego_ah_ga');
        this.btnAyuda_ah_ga = document.getElementById('botonAyuda_ah_ga');
        this.btnReiniciar_ah_ga = document.getElementById('botonReiniciar_ah_ga');
        this.pantallaLogin = document.getElementById('pantallaLogin');
        this.pantallaJuego = document.getElementById('pantallaJuego');
        this.btnSalir = document.getElementById('botonSalir');

        this.ui_ah_ga = new UIHandler_ah_ga();

        // No inicializamos el juego todavía
        this.juego_ah_ga = null;

        // Escuchar cambios de autenticación
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log('✅ Usuario autenticado:', user.email);
                this.mostrarPantallaJuego();
                this.iniciarJuego_ah_ga();
            } else {
                console.log('⚠️ No hay usuario logueado, mostrar pantalla login');
                this.mostrarPantallaLogin();
                this.destruirJuego_ah_ga();
            }
        });

        // Conectar eventos de UI login/juego
        this.conectarEventos_ah_ga();
    }

    conectarEventos_ah_ga() {
        // Botón ayuda
        this.btnAyuda_ah_ga?.addEventListener('click', () => {
            this.ui_ah_ga.mostrarReglas_ah_ga();
        });

        // Botón reiniciar
        this.btnReiniciar_ah_ga?.addEventListener('click', () => {
            this.juego_ah_ga?.reiniciar_ah_ga();
        });

        // Evento cerrar sesión
        this.btnSalir?.addEventListener('click', async () => {
            await cerrarSesion();
        });

        // Eventos de teclado para el juego (solo si juego iniciado)
        document.addEventListener('keydown', (e) => {
            this.juego_ah_ga?.manejarTecla_ah_ga?.(e);
        });

        // Aquí deberías agregar también los eventos del formulario de login y registro
        // que llamen a iniciarSesion() y registrarUsuario()
        // Por ejemplo:

        // Login (asumiendo formulario con id="loginForm" y campos "email", "password")
        const loginForm = document.querySelector('#loginForm form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                try {
                    await iniciarSesion(email, password);
                    // El onAuthStateChanged detectará el login y cargará el juego
                } catch (error) {
                    alert('Error en login: ' + error.message);
                }
            });
        }

        // Registro (asumiendo formulario con id="registerForm" y campos necesarios)
        const registerForm = document.querySelector('#registerForm form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const username = document.getElementById('username').value;
                const birthDate = document.getElementById('birthDate').value;
                const acceptTerms = document.getElementById('terms').checked;

                if (password !== confirmPassword) {
                    alert('⚠️ Las contraseñas no coinciden.');
                    return;
                }
                if (!acceptTerms) {
                    alert('⚠️ Debes aceptar los términos y condiciones.');
                    return;
                }

                try {
                    await registrarUsuario(email, password, {
                        nombre: firstName,
                        apellido: lastName,
                        username,
                        fecha_nacimiento: birthDate,
                        rol: 'usuario',
                    });
                    alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
                    registerForm.reset();
                    // Podrías cambiar automáticamente a pantalla de login aquí
                } catch (error) {
                    alert('Error en registro: ' + error.message);
                }
            });
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
            // Si tienes métodos para limpiar o destruir el juego, los llamas aquí
            this.juego_ah_ga = null;
        }
    }

    mostrarPantallaLogin() {
        this.pantallaLogin?.classList.remove('hidden');
        this.pantallaJuego?.classList.add('hidden');
    }

    mostrarPantallaJuego() {
        this.pantallaLogin?.classList.add('hidden');
        this.pantallaJuego?.classList.remove('hidden');
    }
}

// === Instanciar la app cuando cargue la página ===
document.addEventListener('DOMContentLoaded', () => {
    new App_ah_ga();
});
