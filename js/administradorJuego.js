// administradorJuego.js
import { TableroJuego_ah_ga } from './tablero.js';

/* Clase para manejar el estado del juego */
class EstadoJuego_ah_ga {
  constructor() {
    this.turnoActual_ah_ga = 'soldado';
    this.juegoActivo_ah_ga = true;
    this.piezaSeleccionada_ah_ga = null;
    this.movimientosPermitidos_ah_ga = [];
  }

  cambiarTurno_ah_ga() {
    this.turnoActual_ah_ga = this.turnoActual_ah_ga === 'soldado' ? 'oficial' : 'soldado';
  }

  reiniciar() {
    this.turnoActual_ah_ga = 'soldado';
    this.juegoActivo_ah_ga = true;
    this.piezaSeleccionada_ah_ga = null;
    this.movimientosPermitidos_ah_ga = [];
  }
}

/* Clase para manejar interacción con la UI */
class InterfazUsuario_ah_ga {
  constructor() {
    this.elementoTurno_ah_ga = document.getElementById('turnoActual_ah_ga');
  }

  actualizarTurno_ah_ga(turno) {
    if (this.elementoTurno_ah_ga) {
      this.elementoTurno_ah_ga.textContent = turno === 'soldado' 
        ? 'Atacantes (Soldados)' 
        : 'Defensores (Oficiales)';
    }
  }

  mostrarModalResultado(mensaje) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm text-center">
        <h2 class="text-2xl font-bold text-green-400 mb-6">${mensaje}</h2>
        <button class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition-colors" 
                id="reiniciarBtn_ah_ga">
          Jugar de nuevo
        </button>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }
}

/* Clase para manejar las reglas del juego */
class ReglasJuego_ah_ga {
  static verificarVictoria(tablero) {
    if (this.verificarVictoriaAtacantes(tablero)) {
      return '¡Los Atacantes han ganado ocupando la fortaleza!';
    }
    if (this.verificarVictoriaDefensores(tablero)) {
      return '¡Los Defensores han ganado eliminando suficientes soldados!';
    }
    if (this.verificarOficialesCapturados(tablero)) {
      return '¡Los Atacantes han ganado capturando a ambos oficiales!';
    }
    return null;
  }

  static verificarVictoriaAtacantes(tablero) {
    // Primero encontrar todas las casillas fortaleza
    const fortalezas = [];
    for (let fila = 0; fila < tablero.filasTotales_ah_ga; fila++) {
      for (let col = 0; col < tablero.columnasTotales_ah_ga; col++) {
        const casilla = tablero.obtenerCasilla_ah_ga(fila, col);
        if (casilla && casilla.esFortaleza_ah_ga) {
          fortalezas.push(casilla);
        }
      }
    }
    
    // Verificar que todas las fortalezas estén ocupadas por soldados
    return fortalezas.every(casilla => 
      casilla.pieza_ah_ga && casilla.pieza_ah_ga.tipoPieza_ah_ga === 'soldado'
    );
  }

  static verificarVictoriaDefensores(tablero) {
    const totalSoldados = tablero.casillasJuego_ah_ga.flat().filter(
      casilla => casilla && casilla.pieza_ah_ga?.tipoPieza_ah_ga === 'soldado'
    ).length;
    return totalSoldados < 9;
  }

  static verificarOficialesCapturados(tablero) {
    const totalOficiales = tablero.casillasJuego_ah_ga.flat().filter(
      casilla => casilla && casilla.pieza_ah_ga?.tipoPieza_ah_ga === 'oficial'
    ).length;
    return totalOficiales === 0;
  }
}

/* Clase principal del controlador del juego */
export class ControladorJuego_ah_ga {
  constructor(canvas_ah_ga) {
    this.canvasJuego_ah_ga = canvas_ah_ga;
    this.contextoJuego_ah_ga = canvas_ah_ga.getContext('2d');
    this.tableroPartida_ah_ga = new TableroJuego_ah_ga(canvas_ah_ga.width, canvas_ah_ga.height);
    this.estadoJuego_ah_ga = new EstadoJuego_ah_ga();
    this.interfazUsuario_ah_ga = new InterfazUsuario_ah_ga();

    this.configurarEventos();
    this.inicializarJuego();
  }

  configurarEventos() {
    this.canvasJuego_ah_ga.addEventListener('click', (evento) => 
      this.manejarClicCanvas(evento));
    this.canvasJuego_ah_ga.addEventListener('mousemove', (evento) => 
      this.manejarMovimientoRaton(evento));
    
    document.getElementById('nuevoJuegoBtn_ah_ga').addEventListener('click', () => 
      this.reiniciarPartida());
  }

  inicializarJuego() {
    this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    this.dibujarEstadoActual();
  }

  manejarClicCanvas(evento) {
    if (!this.estadoJuego_ah_ga.juegoActivo_ah_ga) return;

    const { fila, columna } = this.obtenerPosicionCasilla(evento);
    const casilla = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila, columna);

    if (!casilla || !casilla.esValida_ah_ga) {
      this.deseleccionarPieza();
      return;
    }

    if (this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga) {
      this.intentarMoverPieza(fila, columna);
    } else {
      this.intentarSeleccionarPieza(casilla);
    }

    this.dibujarEstadoActual();
  }

  obtenerPosicionCasilla(evento) {
    const rect = this.canvasJuego_ah_ga.getBoundingClientRect();
    return {
      fila: Math.floor((evento.clientY - rect.top) / this.tableroPartida_ah_ga.tamanoCasilla_ah_ga),
      columna: Math.floor((evento.clientX - rect.left) / this.tableroPartida_ah_ga.tamanoCasilla_ah_ga)
    };
  }

  intentarMoverPieza(fila, columna) {
    const movimientoValido = this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga.some(
      m => m.fila_ah_ga === fila && m.columna_ah_ga === columna
    );

    if (movimientoValido) {
      this.realizarMovimiento(fila, columna);
      this.estadoJuego_ah_ga.cambiarTurno_ah_ga();
      this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    }
    this.deseleccionarPieza();
  }

  realizarMovimiento(fila, columna) {
    const movimiento = this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga.find(
      m => m.fila_ah_ga === fila && m.columna_ah_ga === columna
    );

    // Mover pieza
    const pieza = this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga;
    const casillaOrigen = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(
      pieza.filaPosicion_ah_ga, 
      pieza.columnaPosicion_ah_ga
    );
    casillaOrigen.pieza_ah_ga = null;

    pieza.moverA_ah_ga(fila, columna);
    this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila, columna).pieza_ah_ga = pieza;

    // Manejar captura
    if (movimiento?.esCaptura_ah_ga) {
      this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(
        movimiento.capturada_ah_ga.fila, 
        movimiento.capturada_ah_ga.columna
      ).pieza_ah_ga = null;
    }

    this.verificarEstadoJuego();
  }

  intentarSeleccionarPieza(casilla) {
    if (casilla.pieza_ah_ga && this.esTurnoValido(casilla.pieza_ah_ga)) {
      this.seleccionarPieza(casilla.pieza_ah_ga);
    }
  }

  esTurnoValido(pieza) {
    return this.estadoJuego_ah_ga.turnoActual_ah_ga === pieza.tipoPieza_ah_ga;
  }

  seleccionarPieza(pieza) {
    this.deseleccionarPieza();
    this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga = pieza;
    pieza.estaSeleccionada_ah_ga = true;
    this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga = pieza.calcularMovimientosValidos_ah_ga(this.tableroPartida_ah_ga);
  }

  deseleccionarPieza() {
    if (this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga) {
      this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga.estaSeleccionada_ah_ga = false;
      this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga = null;
    }
    this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga = [];
  }

  manejarMovimientoRaton(evento) {
    if (!this.estadoJuego_ah_ga.juegoActivo_ah_ga) return;

    const { fila, columna } = this.obtenerPosicionCasilla(evento);
    const casilla = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila, columna);

    // Resetear hover
    this.tableroPartida_ah_ga.casillasJuego_ah_ga.flat().forEach(c => {
      if (c.pieza_ah_ga) c.pieza_ah_ga.estaSobre_ah_ga = false;
    });

    // Aplicar hover si es válido
    if (casilla?.esValida_ah_ga && casilla.pieza_ah_ga && 
        this.esTurnoValido(casilla.pieza_ah_ga) &&
        !casilla.pieza_ah_ga.estaSeleccionada_ah_ga) {
      casilla.pieza_ah_ga.estaSobre_ah_ga = true;
    }

    this.dibujarEstadoActual();
  }

  verificarEstadoJuego() {
    const resultado = ReglasJuego_ah_ga.verificarVictoria(this.tableroPartida_ah_ga);
    if (resultado) {
      this.mostrarResultado(resultado);
    }
  }

  mostrarResultado(mensaje) {
    this.estadoJuego_ah_ga.juegoActivo_ah_ga = false;
    const modal = this.interfazUsuario_ah_ga.mostrarModalResultado(mensaje);
    
    modal.querySelector('#reiniciarBtn_ah_ga').addEventListener('click', () => {
      modal.remove();
      this.reiniciarPartida();
    });
  }

  dibujarEstadoActual() {
    this.tableroPartida_ah_ga.dibujarTablero_ah_ga(
      this.contextoJuego_ah_ga, 
      this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga
    );
  }

  reiniciarPartida() {
    this.tableroPartida_ah_ga = new TableroJuego_ah_ga(
      this.canvasJuego_ah_ga.width, 
      this.canvasJuego_ga.height
    );
    this.estadoJuego_ah_ga.reiniciar();
    this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    this.dibujarEstadoActual();
  }
}