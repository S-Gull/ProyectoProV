// tablero.js
import { PiezaFactory_ah_ga } from './piezas.js';

/* Clase base abstracta para el tablero */
class TableroBase_ah_ga {
  constructor(filas_ah_ga, columnas_ah_ga) {
    this.filasTotales_ah_ga = filas_ah_ga;
    this.columnasTotales_ah_ga = columnas_ah_ga;
    this.casillasJuego_ah_ga = [];
    this.inicializarEstructura_ah_ga();
  }

  inicializarEstructura_ah_ga() {
    throw new Error("Método abstracto debe ser implementado por subclases");
  }

  obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga) {
    if (!this.esCasillaValida_ah_ga(fila_ah_ga, columna_ah_ga)) {
      return null;
    }
    return this.casillasJuego_ah_ga[fila_ah_ga][columna_ah_ga];
  }

  esCasillaValida_ah_ga(fila_ah_ga, columna_ah_ga) {
    return (
      fila_ah_ga >= 0 &&
      fila_ah_ga < this.filasTotales_ah_ga &&
      columna_ah_ga >= 0 &&
      columna_ah_ga < this.columnasTotales_ah_ga &&
      this.casillasJuego_ah_ga[fila_ah_ga]?.[columna_ah_ga]?.esValida_ah_ga
    );
  }

  esCasillaFortaleza_ah_ga(fila_ah_ga, columna_ah_ga) {
    const casilla_ah_ga = this.obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga);
    return casilla_ah_ga ? casilla_ah_ga.esFortaleza_ah_ga : false;
  }
}

/* Clase para manejar el renderizado del tablero */
class RenderizadorTablero_ah_ga {
  constructor(tablero_ah_ga) {
    this.tablero_ah_ga = tablero_ah_ga;
  }

  dibujar_ah_ga(contexto_ah_ga, movimientosPosibles_ah_ga = []) {
    contexto_ah_ga.clearRect(0, 0,
      this.tablero_ah_ga.anchoCanvas_ah_ga,
      this.tablero_ah_ga.altoCanvas_ah_ga);

    for (let fila_ah_ga = 0; fila_ah_ga < this.tablero_ah_ga.filasTotales_ah_ga; fila_ah_ga++) {
      for (let col_ah_ga = 0; col_ah_ga < this.tablero_ah_ga.columnasTotales_ah_ga; col_ah_ga++) {
        this.dibujarCasilla_ah_ga(contexto_ah_ga, fila_ah_ga, col_ah_ga, movimientosPosibles_ah_ga);
      }
    }
  }

  dibujarCasilla_ah_ga(contexto_ah_ga, fila_ah_ga, col_ah_ga, movimientosPosibles_ah_ga) {
    const casilla_ah_ga = this.tablero_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, col_ah_ga);
    if (!casilla_ah_ga || !casilla_ah_ga.esValida_ah_ga) return;

    this.dibujarFondoCasilla_ah_ga(contexto_ah_ga, casilla_ah_ga, fila_ah_ga, col_ah_ga);

    if (this.esMovimientoPosible_ah_ga(movimientosPosibles_ah_ga, fila_ah_ga, col_ah_ga)) {
      this.dibujarIndicadorMovimiento_ah_ga(contexto_ah_ga, fila_ah_ga, col_ah_ga);
    }

    if (casilla_ah_ga.pieza_ah_ga) {
      this.dibujarPieza_ah_ga(contexto_ah_ga, casilla_ah_ga.pieza_ah_ga, fila_ah_ga, col_ah_ga);
    }
  }

  dibujarFondoCasilla_ah_ga(contexto_ah_ga, casilla_ah_ga, fila_ah_ga, col_ah_ga) {
    const x_ah_ga = col_ah_ga * this.tablero_ah_ga.tamanoCasilla_ah_ga;
    const y_ah_ga = fila_ah_ga * this.tablero_ah_ga.tamanoCasilla_ah_ga;

    contexto_ah_ga.fillStyle = casilla_ah_ga.esFortaleza_ah_ga ? '#3F7D20' : '#2D2D2D';
    contexto_ah_ga.fillRect(x_ah_ga, y_ah_ga, this.tablero_ah_ga.tamanoCasilla_ah_ga, this.tablero_ah_ga.tamanoCasilla_ah_ga);

    contexto_ah_ga.strokeStyle = '#454955';
    contexto_ah_ga.strokeRect(x_ah_ga, y_ah_ga, this.tablero_ah_ga.tamanoCasilla_ah_ga, this.tablero_ah_ga.tamanoCasilla_ah_ga);
  }

  dibujarIndicadorMovimiento_ah_ga(contexto_ah_ga, fila_ah_ga, col_ah_ga) {
    const centroX_ah_ga = (col_ah_ga + 0.5) * this.tablero_ah_ga.tamanoCasilla_ah_ga;
    const centroY_ah_ga = (fila_ah_ga + 0.5) * this.tablero_ah_ga.tamanoCasilla_ah_ga;
    const radio_ah_ga = this.tablero_ah_ga.tamanoCasilla_ah_ga * 0.15;

    contexto_ah_ga.beginPath();
    contexto_ah_ga.arc(centroX_ah_ga, centroY_ah_ga, radio_ah_ga, 0, Math.PI * 2);
    contexto_ah_ga.fillStyle = 'rgba(255, 255, 254, 0.4)';
    contexto_ah_ga.fill();
  }

  dibujarPieza_ah_ga(contexto_ah_ga, pieza_ah_ga, fila_ah_ga, col_ah_ga) {
    const centroX_ah_ga = (col_ah_ga + 0.5) * this.tablero_ah_ga.tamanoCasilla_ah_ga;
    const centroY_ah_ga = (fila_ah_ga + 0.5) * this.tablero_ah_ga.tamanoCasilla_ah_ga;
    const radio_ah_ga = this.tablero_ah_ga.tamanoCasilla_ah_ga * 0.37;

    this.dibujarSeleccion_ah_ga(contexto_ah_ga, pieza_ah_ga, centroX_ah_ga, centroY_ah_ga, radio_ah_ga);
    this.dibujarCuerpo_ah_ga(contexto_ah_ga, pieza_ah_ga, centroX_ah_ga, centroY_ah_ga, radio_ah_ga);
  }

  dibujarSeleccion_ah_ga(contexto_ah_ga, pieza_ah_ga, x_ah_ga, y_ah_ga, radio_ah_ga) {
    if (pieza_ah_ga.estaSeleccionada_ah_ga) {
      contexto_ah_ga.beginPath();
      contexto_ah_ga.arc(x_ah_ga, y_ah_ga, radio_ah_ga + 5, 0, Math.PI * 2);
      contexto_ah_ga.fillStyle = '#FFFFFF';
      contexto_ah_ga.fill();
    } else if (pieza_ah_ga.estaSobre_ah_ga) {
      contexto_ah_ga.beginPath();
      contexto_ah_ga.arc(x_ah_ga, y_ah_ga, radio_ah_ga + 3, 0, Math.PI * 2);
      contexto_ah_ga.fillStyle = '#4d6bfe';
      contexto_ah_ga.fill();
    }
  }

  dibujarCuerpo_ah_ga(contexto_ah_ga, pieza_ah_ga, x_ah_ga, y_ah_ga, radio_ah_ga) {
    contexto_ah_ga.beginPath();
    contexto_ah_ga.arc(x_ah_ga, y_ah_ga, radio_ah_ga, 0, Math.PI * 2);
    contexto_ah_ga.fillStyle = pieza_ah_ga.tipoPieza_ah_ga === 'oficial' ? '#FF3A3A' : '#72B01D';
    contexto_ah_ga.fill();
    contexto_ah_ga.strokeStyle = 'black';
    contexto_ah_ga.lineWidth = 1;
    contexto_ah_ga.stroke();
  }

  esMovimientoPosible_ah_ga(movimientosPosibles_ah_ga, fila_ah_ga, col_ah_ga) {
    return movimientosPosibles_ah_ga.some(
      pos => pos.fila_ah_ga === fila_ah_ga && pos.columna_ah_ga === col_ah_ga
    ) && !this.tablero_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, col_ah_ga).pieza_ah_ga;
  }
}

/* Clase concreta del tablero del juego */
export class TableroJuego_ah_ga extends TableroBase_ah_ga {
  constructor(anchoCanvas_ah_ga, altoCanvas_ah_ga) {
    super(7, 7);
    this.anchoCanvas_ah_ga = anchoCanvas_ah_ga;
    this.altoCanvas_ah_ga = altoCanvas_ah_ga;
    this.tamanoCasilla_ah_ga = this.calcularTamanoCasilla_ah_ga();
    this.renderizador_ah_ga = new RenderizadorTablero_ah_ga(this);
    this.puntosDiagonales_ah_ga = new Set([
      '0,2', '0,4',
      '1,3',
      '2,0', '2,2', '2,4', '2,6',
      '3,1', '3,3', '3,5',
      '4,0', '4,2', '4,4', '4,6',
      '5,3',
      '6,2', '6,4'
    ]);
  }

  calcularTamanoCasilla_ah_ga() {
    return Math.min(
      Math.floor(this.anchoCanvas_ah_ga / this.columnasTotales_ah_ga),
      Math.floor(this.altoCanvas_ah_ga / this.filasTotales_ah_ga)
    );
  }

  inicializarEstructura_ah_ga() {
    const estructura_ah_ga = [
      ['b', 'b', 'F', 'F', 'F', 'b', 'b'],
      ['b', 'b', 'F', 'F', 'F', 'b', 'b'],
      ['S', 'S', 'F', 'F', 'F', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['b', 'b', 'S', 'S', 'S', 'b', 'b'],
      ['b', 'b', 'S', 'S', 'S', 'b', 'b']
    ];

    for (let fila_ah_ga = 0; fila_ah_ga < this.filasTotales_ah_ga; fila_ah_ga++) {
      this.casillasJuego_ah_ga[fila_ah_ga] = [];
      for (let col_ah_ga = 0; col_ah_ga < this.columnasTotales_ah_ga; col_ah_ga++) {
        const tipo_ah_ga = estructura_ah_ga[fila_ah_ga][col_ah_ga];
        this.casillasJuego_ah_ga[fila_ah_ga][col_ah_ga] = {
          fila_ah_ga: fila_ah_ga,
          columna_ah_ga: col_ah_ga,
          esFortaleza_ah_ga: tipo_ah_ga === 'F',
          esValida_ah_ga: tipo_ah_ga !== 'b',
          pieza_ah_ga: null
        };
      }
    }

    this.colocarPiezasIniciales_ah_ga();
  }

  colocarPiezasIniciales_ah_ga() {
    this.colocarOficiales_ah_ga();
    this.colocarSoldados_ah_ga();
  }

  colocarOficiales_ah_ga() {
    const posiciones_ah_ga = [[1, 2], [1, 4]];
    posiciones_ah_ga.forEach(([fila_ah_ga, col_ah_ga]) => {
      this.casillasJuego_ah_ga[fila_ah_ga][col_ah_ga].pieza_ah_ga =
        PiezaFactory_ah_ga.crearPieza_ah_ga('oficial', fila_ah_ga, col_ah_ga);
    });
  }

  colocarSoldados_ah_ga() {
    const posiciones_ah_ga = [
      [2, 0], [2, 1], [2, 5], [2, 6],
      [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
      [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
      [5, 2], [5, 3], [5, 4],
      [6, 2], [6, 3], [6, 4]
    ];

    posiciones_ah_ga.forEach(([fila_ah_ga, col_ah_ga]) => {
      if (!(fila_ah_ga === 1 && (col_ah_ga === 2 || col_ah_ga === 4))) {
        this.casillasJuego_ah_ga[fila_ah_ga][col_ah_ga].pieza_ah_ga =
          PiezaFactory_ah_ga.crearPieza_ah_ga('soldado', fila_ah_ga, col_ah_ga);
      }
    });
  }

  puedeMoverseDiagonal_ah_ga(fila_ah_ga, columna_ah_ga) {
    return this.puntosDiagonales_ah_ga.has(`${fila_ah_ga},${columna_ah_ga}`);
  }

  dibujarTablero_ah_ga(contexto_ah_ga, movimientosPosibles_ah_ga = []) {
    this.renderizador_ah_ga.dibujar_ah_ga(contexto_ah_ga, movimientosPosibles_ah_ga);
  }

  reiniciar_ah_ga() {
    this.casillasJuego_ah_ga = [];
    this.inicializarEstructura_ah_ga();
  }
}