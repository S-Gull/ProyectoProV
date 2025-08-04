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

  reiniciar_ah_ga() {
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
    this.elementoJugador1_ah_ga = document.getElementById('jugador1-info');
    this.elementoJugador2_ah_ga = document.getElementById('jugador2-info');
  }

  actualizarTurno_ah_ga(turno_ah_ga) {
    if (this.elementoTurno_ah_ga) {
      this.elementoTurno_ah_ga.textContent = turno_ah_ga === 'soldado'
        ? 'Atacantes (Soldados)'
        : 'Defensores (Oficiales)';
    }
  }

  actualizarNombresJugadores(nombreJ1, nombreJ2, equipoJ1, equipoJ2) {
    if (this.elementoJugador1_ah_ga) {
      this.elementoJugador1_ah_ga.textContent = `${nombreJ1} (${equipoJ1 === 'soldado' ? 'Atacantes' : 'Defensores'})`;
    }
    if (this.elementoJugador2_ah_ga) {
      this.elementoJugador2_ah_ga.textContent = `${nombreJ2} (${equipoJ2 === 'soldado' ? 'Atacantes' : 'Defensores'})`;
    }
  }

  mostrarModalResultado_ah_ga(mensaje_ah_ga) {
    const modal_ah_ga = document.createElement('div');
    modal_ah_ga.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';
    modal_ah_ga.innerHTML = `
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm text-center">
        <h2 class="text-2xl font-bold text-green-400 mb-6">${mensaje_ah_ga}</h2>
        <button class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition-colors"
                id="reiniciarBtn_ah_ga">
          Jugar de nuevo
        </button>
      </div>
    `;
    document.body.appendChild(modal_ah_ga);
    return modal_ah_ga;
  }
}

/* Clase para manejar las reglas del juego */
class ReglasJuego_ah_ga {
  static verificarVictoria_ah_ga(tablero_ah_ga) {
    if (this.verificarVictoriaAtacantes_ah_ga(tablero_ah_ga)) {
      return '¡Los Atacantes han ganado ocupando la fortaleza!';
    }
    if (this.verificarVictoriaDefensores_ah_ga(tablero_ah_ga)) {
      return '¡Los Defensores han ganado eliminando suficientes soldados!';
    }
    if (this.verificarOficialesCapturados_ah_ga(tablero_ah_ga)) {
      return '¡Los Atacantes han ganado capturando a ambos oficiales!';
    }
    return null;
  }

  static verificarVictoriaAtacantes_ah_ga(tablero_ah_ga) {
    // Primero encontrar todas las casillas fortaleza
    const fortalezas_ah_ga = [];
    for (let fila_ah_ga = 0; fila_ah_ga < tablero_ah_ga.filasTotales_ah_ga; fila_ah_ga++) {
      for (let col_ah_ga = 0; col_ah_ga < tablero_ah_ga.columnasTotales_ah_ga; col_ah_ga++) {
        const casilla_ah_ga = tablero_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, col_ah_ga);
        if (casilla_ah_ga && casilla_ah_ga.esFortaleza_ah_ga) {
          fortalezas_ah_ga.push(casilla_ah_ga);
        }
      }
    }

    // Verificar que todas las fortalezas estén ocupadas por soldados
    return fortalezas_ah_ga.every(casilla_ah_ga =>
      casilla_ah_ga.pieza_ah_ga && casilla_ah_ga.pieza_ah_ga.tipoPieza_ah_ga === 'soldado'
    );
  }

  static verificarVictoriaDefensores_ah_ga(tablero_ah_ga) {
    const totalSoldados_ah_ga = tablero_ah_ga.casillasJuego_ah_ga.flat().filter(
      casilla_ah_ga => casilla_ah_ga && casilla_ah_ga.pieza_ah_ga?.tipoPieza_ah_ga === 'soldado'
    ).length;
    return totalSoldados_ah_ga < 9;
  }

  static verificarOficialesCapturados_ah_ga(tablero_ah_ga) {
    const totalOficiales_ah_ga = tablero_ah_ga.casillasJuego_ah_ga.flat().filter(
      casilla_ah_ga => casilla_ah_ga && casilla_ah_ga.pieza_ah_ga?.tipoPieza_ah_ga === 'oficial'
    ).length;
    return totalOficiales_ah_ga === 0;
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
    
    // Información de los jugadores
    this.jugadores_ah_ga = {
      jugador1: null,
      jugador2: null
    };
    this.tiempoInicioPartida_ah_ga = null;
    this.callbackResultado_ah_ga = null;

    this.configurarEventos_ah_ga();
    this.inicializarJuego_ah_ga();
  }

  // Configurar información de los jugadores
  configurarJugadores(datosJugadores) {
    this.jugadores_ah_ga = datosJugadores;
    this.tiempoInicioPartida_ah_ga = Date.now();
    
    // Actualizar la interfaz con los nombres de los jugadores
    this.interfazUsuario_ah_ga.actualizarNombresJugadores(
      datosJugadores.jugador1.nombre,
      datosJugadores.jugador2.nombre,
      datosJugadores.jugador1.equipo,
      datosJugadores.jugador2.equipo
    );
  }

  // Establecer callback para cuando termine la partida
  establecerCallbackResultado(callback) {
    this.callbackResultado_ah_ga = callback;
  }

  configurarEventos_ah_ga() {
    this.canvasJuego_ah_ga.addEventListener('click', (evento_ah_ga) =>
      this.manejarClicCanvas_ah_ga(evento_ah_ga));
    this.canvasJuego_ah_ga.addEventListener('mousemove', (evento_ah_ga) =>
      this.manejarMovimientoRaton_ah_ga(evento_ah_ga));

    document.getElementById('nuevoJuegoBtn_ah_ga').addEventListener('click', () =>
      this.reiniciarPartida_ah_ga());
  }

  inicializarJuego_ah_ga() {
    this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    this.dibujarEstadoActual_ah_ga();
  }

  manejarClicCanvas_ah_ga(evento_ah_ga) {
    if (!this.estadoJuego_ah_ga.juegoActivo_ah_ga) return;

    const { fila_ah_ga, columna_ah_ga } = this.obtenerPosicionCasilla_ah_ga(evento_ah_ga);
    const casilla_ah_ga = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga);

    if (!casilla_ah_ga || !casilla_ah_ga.esValida_ah_ga) {
      this.deseleccionarPieza_ah_ga();
      return;
    }

    if (this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga) {
      this.intentarMoverPieza_ah_ga(fila_ah_ga, columna_ah_ga);
    } else {
      this.intentarSeleccionarPieza_ah_ga(casilla_ah_ga);
    }

    this.dibujarEstadoActual_ah_ga();
  }

  obtenerPosicionCasilla_ah_ga(evento_ah_ga) {
    const rect_ah_ga = this.canvasJuego_ah_ga.getBoundingClientRect();
    return {
      fila_ah_ga: Math.floor((evento_ah_ga.clientY - rect_ah_ga.top) / this.tableroPartida_ah_ga.tamanoCasilla_ah_ga),
      columna_ah_ga: Math.floor((evento_ah_ga.clientX - rect_ah_ga.left) / this.tableroPartida_ah_ga.tamanoCasilla_ah_ga)
    };
  }

  intentarMoverPieza_ah_ga(fila_ah_ga, columna_ah_ga) {
    const movimientoValido_ah_ga = this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga.some(
      m_ah_ga => m_ah_ga.fila_ah_ga === fila_ah_ga && m_ah_ga.columna_ah_ga === columna_ah_ga
    );

    if (movimientoValido_ah_ga) {
      this.realizarMovimiento_ah_ga(fila_ah_ga, columna_ah_ga);
      this.estadoJuego_ah_ga.cambiarTurno_ah_ga();
      this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    }
    this.deseleccionarPieza_ah_ga();
  }

  realizarMovimiento_ah_ga(fila_ah_ga, columna_ah_ga) {
    const movimiento_ah_ga = this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga.find(
      m_ah_ga => m_ah_ga.fila_ah_ga === fila_ah_ga && m_ah_ga.columna_ah_ga === columna_ah_ga
    );

    // Mover pieza
    const pieza_ah_ga = this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga;
    const casillaOrigen_ah_ga = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(
      pieza_ah_ga.filaPosicion_ah_ga,
      pieza_ah_ga.columnaPosicion_ah_ga
    );
    casillaOrigen_ah_ga.pieza_ah_ga = null;

    pieza_ah_ga.moverA_ah_ga(fila_ah_ga, columna_ah_ga);
    this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga).pieza_ah_ga = pieza_ah_ga;

    // Manejar captura
    if (movimiento_ah_ga?.esCaptura_ah_ga) {
      this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(
        movimiento_ah_ga.capturada_ah_ga.fila,
        movimiento_ah_ga.capturada_ah_ga.columna
      ).pieza_ah_ga = null;
    }

    this.verificarEstadoJuego_ah_ga();
  }

  intentarSeleccionarPieza_ah_ga(casilla_ah_ga) {
    if (casilla_ah_ga.pieza_ah_ga && this.esTurnoValido_ah_ga(casilla_ah_ga.pieza_ah_ga)) {
      this.seleccionarPieza_ah_ga(casilla_ah_ga.pieza_ah_ga);
    }
  }

  esTurnoValido_ah_ga(pieza_ah_ga) {
    return this.estadoJuego_ah_ga.turnoActual_ah_ga === pieza_ah_ga.tipoPieza_ah_ga;
  }

  seleccionarPieza_ah_ga(pieza_ah_ga) {
    this.deseleccionarPieza_ah_ga();
    this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga = pieza_ah_ga;
    pieza_ah_ga.estaSeleccionada_ah_ga = true;
    this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga = pieza_ah_ga.calcularMovimientosValidos_ah_ga(this.tableroPartida_ah_ga);
  }

  deseleccionarPieza_ah_ga() {
    if (this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga) {
      this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga.estaSeleccionada_ah_ga = false;
      this.estadoJuego_ah_ga.piezaSeleccionada_ah_ga = null;
    }
    this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga = [];
  }

  manejarMovimientoRaton_ah_ga(evento_ah_ga) {
    if (!this.estadoJuego_ah_ga.juegoActivo_ah_ga) return;

    const { fila_ah_ga, columna_ah_ga } = this.obtenerPosicionCasilla_ah_ga(evento_ah_ga);
    const casilla_ah_ga = this.tableroPartida_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga);

    // Resetear hover
    this.tableroPartida_ah_ga.casillasJuego_ah_ga.flat().forEach(c_ah_ga => {
      if (c_ah_ga.pieza_ah_ga) c_ah_ga.pieza_ah_ga.estaSobre_ah_ga = false;
    });

    // Aplicar hover si es válido
    if (casilla_ah_ga?.esValida_ah_ga && casilla_ah_ga.pieza_ah_ga &&
        this.esTurnoValido_ah_ga(casilla_ah_ga.pieza_ah_ga) &&
        !casilla_ah_ga.pieza_ah_ga.estaSeleccionada_ah_ga) {
      casilla_ah_ga.pieza_ah_ga.estaSobre_ah_ga = true;
    }

    this.dibujarEstadoActual_ah_ga();
  }

  verificarEstadoJuego_ah_ga() {
    const resultado_ah_ga = ReglasJuego_ah_ga.verificarVictoria_ah_ga(this.tableroPartida_ah_ga);
    if (resultado_ah_ga) {
      this.procesarFinPartida_ah_ga(resultado_ah_ga);
    }
  }

  procesarFinPartida_ah_ga(mensajeVictoria) {
    this.estadoJuego_ah_ga.juegoActivo_ah_ga = false;
    
    // Determinar ganador y tipo de victoria
    let ganadorId, equipoGanador, tipoVictoria;
    
    if (mensajeVictoria.includes('Atacantes')) {
      equipoGanador = 'soldado';
      tipoVictoria = mensajeVictoria.includes('fortaleza') ? 'ocupacion_fortaleza' : 'captura_oficiales';
      
      // Determinar qué jugador ganó (solo si los jugadores están configurados)
      if (this.jugadores_ah_ga && this.jugadores_ah_ga.jugador1 && this.jugadores_ah_ga.jugador2) {
        if (this.jugadores_ah_ga.jugador1.equipo === 'soldado') {
          ganadorId = this.jugadores_ah_ga.jugador1.id;
        } else if (this.jugadores_ah_ga.jugador2.id) {
          // Solo asignar ID si el jugador 2 está registrado
          ganadorId = this.jugadores_ah_ga.jugador2.id;
        } else {
          // Si el jugador 2 es invitado, usar un identificador especial
          ganadorId = 'invitado';
        }
      }
    } else {
      equipoGanador = 'oficial';
      tipoVictoria = 'eliminacion_soldados';
      
      // Determinar qué jugador ganó (solo si los jugadores están configurados)
      if (this.jugadores_ah_ga && this.jugadores_ah_ga.jugador1 && this.jugadores_ah_ga.jugador2) {
        if (this.jugadores_ah_ga.jugador1.equipo === 'oficial') {
          ganadorId = this.jugadores_ah_ga.jugador1.id;
        } else if (this.jugadores_ah_ga.jugador2.id) {
          // Solo asignar ID si el jugador 2 está registrado
          ganadorId = this.jugadores_ah_ga.jugador2.id;
        } else {
          // Si el jugador 2 es invitado, usar un identificador especial
          ganadorId = 'invitado';
        }
      }
    }
    
    // Si hay un callback registrado, llamarlo con los datos del resultado
    // Ahora siempre llamamos al callback, incluso si el ganador es invitado
    if (this.callbackResultado_ah_ga && ganadorId) {
      this.callbackResultado_ah_ga(ganadorId, equipoGanador, tipoVictoria);
    }
    
    this.mostrarResultado_ah_ga(mensajeVictoria);
  }

  mostrarResultado_ah_ga(mensaje_ah_ga) {
    this.estadoJuego_ah_ga.juegoActivo_ah_ga = false;
    const modal_ah_ga = this.interfazUsuario_ah_ga.mostrarModalResultado_ah_ga(mensaje_ah_ga);

    modal_ah_ga.querySelector('#reiniciarBtn_ah_ga').addEventListener('click', () => {
      modal_ah_ga.remove();
      this.reiniciarPartida_ah_ga();
    });
  }

  dibujarEstadoActual_ah_ga() {
    this.tableroPartida_ah_ga.dibujarTablero_ah_ga(
      this.contextoJuego_ah_ga,
      this.estadoJuego_ah_ga.movimientosPermitidos_ah_ga
    );
  }

  reiniciarPartida_ah_ga() {
    this.tableroPartida_ah_ga = new TableroJuego_ah_ga(
      this.canvasJuego_ah_ga.width,
      this.canvasJuego_ah_ga.height
    );
    this.estadoJuego_ah_ga.reiniciar_ah_ga();
    this.interfazUsuario_ah_ga.actualizarTurno_ah_ga(this.estadoJuego_ah_ga.turnoActual_ah_ga);
    
    // Mantener la configuración de jugadores si existe
    if (this.jugadores_ah_ga && this.jugadores_ah_ga.jugador1 && this.jugadores_ah_ga.jugador2) {
      this.interfazUsuario_ah_ga.actualizarNombresJugadores(
        this.jugadores_ah_ga.jugador1.nombre,
        this.jugadores_ah_ga.jugador2.nombre,
        this.jugadores_ah_ga.jugador1.equipo,
        this.jugadores_ah_ga.jugador2.equipo
      );
    }
    
    this.dibujarEstadoActual_ah_ga();
  } 
}