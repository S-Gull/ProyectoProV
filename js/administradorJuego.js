// administradorJuego.js
import { TableroJuego_ahga } from "./tablero.js";

/* Clase para manejar el estado del juego */
class EstadoJuego_ahga {
  constructor() {
    this.turnoActual_ahga = "soldado";
    this.juegoActivo_ahga = true;
    this.piezaSeleccionada_ahga = null;
    this.movimientosPermitidos_ahga = [];
  }

  cambiarTurno_ahga() {
    this.turnoActual_ahga =
      this.turnoActual_ahga === "soldado" ? "oficial" : "soldado";
  }

  reiniciar_ahga() {
    this.turnoActual_ahga = "soldado";
    this.juegoActivo_ahga = true;
    this.piezaSeleccionada_ahga = null;
    this.movimientosPermitidos_ahga = [];
  }
}

/* Clase para manejar interacción con la UI */
class InterfazUsuario_ahga {
  constructor() {
    this.elementoTurno_ahga = document.getElementById("turnoActual_ah_ga");
  }

  actualizarTurno_ahga(turno_ahga) {
    if (this.elementoTurno_ahga) {
      this.elementoTurno_ahga.textContent =
        turno_ahga === "soldado"
          ? "Atacantes (Soldados)"
          : "Defensores (Oficiales)";
    }
  }

  mostrarModalResultado_ahga(mensaje_ahga) {
    const modal_ahga = document.createElement("div");
    modal_ahga.className =
      "fixed inset-0 bg-black/80 flex items-center justify-center z-50";
    modal_ahga.innerHTML = `
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm text-center">
        <h2 class="text-2xl font-bold text-green-400 mb-6">${mensaje_ahga}</h2>
        <button class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition-colors"
                id="reiniciarBtn_ahga">
          Jugar de nuevo
        </button>
      </div>
    `;
    document.body.appendChild(modal_ahga);
    return modal_ahga;
  }
}

/* Clase para manejar las reglas del juego */
class ReglasJuego_ahga {
  static verificarVictoria_ahga(tablero_ahga) {
    if (this.verificarVictoriaAtacantes_ahga(tablero_ahga)) {
      return "¡Los Atacantes han ganado ocupando la fortaleza!";
    }
    if (this.verificarVictoriaDefensores_ahga(tablero_ahga)) {
      return "¡Los Defensores han ganado eliminando suficientes soldados!";
    }
    if (this.verificarOficialesCapturados_ahga(tablero_ahga)) {
      return "¡Los Atacantes han ganado capturando a ambos oficiales!";
    }
    return null;
  }

  static verificarVictoriaAtacantes_ahga(tablero_ahga) {
    // Primero encontrar todas las casillas fortaleza
    const fortalezas_ahga = [];
    for (
      let fila_ahga = 0;
      fila_ahga < tablero_ahga.filasTotales_ahga;
      fila_ahga++
    ) {
      for (
        let col_ahga = 0;
        col_ahga < tablero_ahga.columnasTotales_ahga;
        col_ahga++
      ) {
        const casilla_ahga = tablero_ahga.obtenerCasilla_ahga(
          fila_ahga,
          col_ahga
        );
        if (casilla_ahga && casilla_ahga.esFortaleza_ahga) {
          fortalezas_ahga.push(casilla_ahga);
        }
      }
    }

    // Verificar que todas las fortalezas estén ocupadas por soldados
    return fortalezas_ahga.every(
      (casilla_ahga) =>
        casilla_ahga.pieza_ahga &&
        casilla_ahga.pieza_ahga.tipoPieza_ahga === "soldado"
    );
  }

  static verificarVictoriaDefensores_ahga(tablero_ahga) {
    const totalSoldados_ahga = tablero_ahga.casillasJuego_ahga
      .flat()
      .filter(
        (casilla_ahga) =>
          casilla_ahga && casilla_ahga.pieza_ahga?.tipoPieza_ahga === "soldado"
      ).length;
    return totalSoldados_ahga < 9;
  }

  static verificarOficialesCapturados_ahga(tablero_ahga) {
    const totalOficiales_ahga = tablero_ahga.casillasJuego_ahga
      .flat()
      .filter(
        (casilla_ahga) =>
          casilla_ahga && casilla_ahga.pieza_ahga?.tipoPieza_ahga === "oficial"
      ).length;
    return totalOficiales_ahga === 0;
  }
}

/* Clase principal del controlador del juego */
export class ControladorJuego_ahga {
  constructor(canvas_ahga) {
    this.canvasJuego_ahga = canvas_ahga;
    this.contextoJuego_ahga = canvas_ahga.getContext("2d");
    this.tableroPartida_ahga = new TableroJuego_ahga(
      canvas_ahga.width,
      canvas_ahga.height
    );
    this.estadoJuego_ahga = new EstadoJuego_ahga();
    this.interfazUsuario_ahga = new InterfazUsuario_ahga();
    this.callbackResultado_ahga = null; // Callback para notificar resultado

    this.configurarEventos_ahga();
    this.inicializarJuego_ahga();
  }

  // Método para establecer callback de resultado
  establecerCallbackResultado(callback) {
    this.callbackResultado_ahga = callback;
  }

  configurarEventos_ahga() {
    this.canvasJuego_ahga.addEventListener("click", (evento_ahga) =>
      this.manejarClicCanvas_ahga(evento_ahga)
    );
    this.canvasJuego_ahga.addEventListener("mousemove", (evento_ahga) =>
      this.manejarMovimientoRaton_ahga(evento_ahga)
    );

    document
      .getElementById("nuevoJuegoBtn_ah_ga")
      .addEventListener("click", () => this.reiniciarPartida_ahga());
  }

  inicializarJuego_ahga() {
    this.interfazUsuario_ahga.actualizarTurno_ahga(
      this.estadoJuego_ahga.turnoActual_ahga
    );
    this.dibujarEstadoActual_ahga();
  }

  manejarClicCanvas_ahga(evento_ahga) {
    if (!this.estadoJuego_ahga.juegoActivo_ahga) return;

    const { fila_ahga, columna_ahga } =
      this.obtenerPosicionCasilla_ahga(evento_ahga);
    const casilla_ahga = this.tableroPartida_ahga.obtenerCasilla_ahga(
      fila_ahga,
      columna_ahga
    );

    if (!casilla_ahga || !casilla_ahga.esValida_ahga) {
      this.deseleccionarPieza_ahga();
      return;
    }

    if (this.estadoJuego_ahga.piezaSeleccionada_ahga) {
      this.intentarMoverPieza_ahga(fila_ahga, columna_ahga);
    } else {
      this.intentarSeleccionarPieza_ahga(casilla_ahga);
    }

    this.dibujarEstadoActual_ahga();
  }

  obtenerPosicionCasilla_ahga(evento_ahga) {
    const rect_ahga = this.canvasJuego_ahga.getBoundingClientRect();
    return {
      fila_ahga: Math.floor(
        (evento_ahga.clientY - rect_ahga.top) /
          this.tableroPartida_ahga.tamanoCasilla_ahga
      ),
      columna_ahga: Math.floor(
        (evento_ahga.clientX - rect_ahga.left) /
          this.tableroPartida_ahga.tamanoCasilla_ahga
      ),
    };
  }

  intentarMoverPieza_ahga(fila_ahga, columna_ahga) {
    const movimientoValido_ahga =
      this.estadoJuego_ahga.movimientosPermitidos_ahga.some(
        (m_ahga) =>
          m_ahga.fila_ahga === fila_ahga && m_ahga.columna_ahga === columna_ahga
      );

    if (movimientoValido_ahga) {
      this.realizarMovimiento_ahga(fila_ahga, columna_ahga);
      this.estadoJuego_ahga.cambiarTurno_ahga();
      this.interfazUsuario_ahga.actualizarTurno_ahga(
        this.estadoJuego_ahga.turnoActual_ahga
      );
    }
    this.deseleccionarPieza_ahga();
  }

  realizarMovimiento_ahga(fila_ahga, columna_ahga) {
    const movimiento_ahga =
      this.estadoJuego_ahga.movimientosPermitidos_ahga.find(
        (m_ahga) =>
          m_ahga.fila_ahga === fila_ahga && m_ahga.columna_ahga === columna_ahga
      );

    // Mover pieza
    const pieza_ahga = this.estadoJuego_ahga.piezaSeleccionada_ahga;
    const casillaOrigen_ahga = this.tableroPartida_ahga.obtenerCasilla_ahga(
      pieza_ahga.filaPosicion_ahga,
      pieza_ahga.columnaPosicion_ahga
    );
    casillaOrigen_ahga.pieza_ahga = null;

    pieza_ahga.moverA_ahga(fila_ahga, columna_ahga);
    this.tableroPartida_ahga.obtenerCasilla_ahga(
      fila_ahga,
      columna_ahga
    ).pieza_ahga = pieza_ahga;

    // Manejar captura
    if (movimiento_ahga?.esCaptura_ahga) {
      this.tableroPartida_ahga.obtenerCasilla_ahga(
        movimiento_ahga.capturada_ahga.fila,
        movimiento_ahga.capturada_ahga.columna
      ).pieza_ahga = null;
    }

    this.verificarEstadoJuego_ahga();
  }

  intentarSeleccionarPieza_ahga(casilla_ahga) {
    if (
      casilla_ahga.pieza_ahga &&
      this.esTurnoValido_ahga(casilla_ahga.pieza_ahga)
    ) {
      this.seleccionarPieza_ahga(casilla_ahga.pieza_ahga);
    }
  }

  esTurnoValido_ahga(pieza_ahga) {
    return this.estadoJuego_ahga.turnoActual_ahga === pieza_ahga.tipoPieza_ahga;
  }

  seleccionarPieza_ahga(pieza_ahga) {
    this.deseleccionarPieza_ahga();
    this.estadoJuego_ahga.piezaSeleccionada_ahga = pieza_ahga;
    pieza_ahga.estaSeleccionada_ahga = true;
    this.estadoJuego_ahga.movimientosPermitidos_ahga =
      pieza_ahga.calcularMovimientosValidos_ahga(this.tableroPartida_ahga);
  }

  deseleccionarPieza_ahga() {
    if (this.estadoJuego_ahga.piezaSeleccionada_ahga) {
      this.estadoJuego_ahga.piezaSeleccionada_ahga.estaSeleccionada_ahga = false;
      this.estadoJuego_ahga.piezaSeleccionada_ahga = null;
    }
    this.estadoJuego_ahga.movimientosPermitidos_ahga = [];
  }

  manejarMovimientoRaton_ahga(evento_ahga) {
    if (!this.estadoJuego_ahga.juegoActivo_ahga) return;

    const { fila_ahga, columna_ahga } =
      this.obtenerPosicionCasilla_ahga(evento_ahga);
    const casilla_ahga = this.tableroPartida_ahga.obtenerCasilla_ahga(
      fila_ahga,
      columna_ahga
    );

    // Resetear hover
    this.tableroPartida_ahga.casillasJuego_ahga.flat().forEach((c_ahga) => {
      if (c_ahga.pieza_ahga) c_ahga.pieza_ahga.estaSobre_ahga = false;
    });

    // Aplicar hover si es válido
    if (
      casilla_ahga?.esValida_ahga &&
      casilla_ahga.pieza_ahga &&
      this.esTurnoValido_ahga(casilla_ahga.pieza_ahga) &&
      !casilla_ahga.pieza_ahga.estaSeleccionada_ahga
    ) {
      casilla_ahga.pieza_ahga.estaSobre_ahga = true;
    }

    this.dibujarEstadoActual_ahga();
  }

  verificarEstadoJuego_ahga() {
    const resultado_ahga = ReglasJuego_ahga.verificarVictoria_ahga(
      this.tableroPartida_ahga
    );
    if (resultado_ahga) {
      this.mostrarResultado_ahga(resultado_ahga);
    }
  }

  mostrarResultado_ahga(mensaje_ahga) {
    this.estadoJuego_ahga.juegoActivo_ahga = false;
    
    // Determinar ganador y tipo de victoria
    let ganador = null;
    let equipoGanador = null;
    let tipoVictoria = null;
    
    if (mensaje_ahga.includes("Atacantes")) {
      equipoGanador = "soldado";
      if (mensaje_ahga.includes("fortaleza")) {
        tipoVictoria = "ocupacion_fortaleza";
      } else if (mensaje_ahga.includes("oficiales")) {
        tipoVictoria = "captura_oficiales";
      }
    } else if (mensaje_ahga.includes("Defensores")) {
      equipoGanador = "oficial";
      tipoVictoria = "eliminacion_soldados";
    }
    
    // Llamar al callback si está definido
    if (this.callbackResultado_ahga && equipoGanador) {
      this.callbackResultado_ahga(ganador, equipoGanador, tipoVictoria);
    }
    
    const modal_ahga =
      this.interfazUsuario_ahga.mostrarModalResultado_ahga(mensaje_ahga);

    modal_ahga
      .querySelector("#reiniciarBtn_ahga")
      .addEventListener("click", () => {
        modal_ahga.remove();
        this.reiniciarPartida_ahga();
      });
  }

  dibujarEstadoActual_ahga() {
    this.tableroPartida_ahga.dibujarTablero_ahga(
      this.contextoJuego_ahga,
      this.estadoJuego_ahga.movimientosPermitidos_ahga
    );
  }

  reiniciarPartida_ahga() {
    this.tableroPartida_ahga = new TableroJuego_ahga(
      this.canvasJuego_ahga.width,
      this.canvasJuego_ahga.height
    );
    this.estadoJuego_ahga.reiniciar_ahga();
    this.interfazUsuario_ahga.actualizarTurno_ahga(
      this.estadoJuego_ahga.turnoActual_ahga
    );
    this.dibujarEstadoActual_ahga();
  }
}
